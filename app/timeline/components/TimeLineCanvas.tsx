import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TimelineCanvasWithScrubberProps, ZoomLevel } from "@/app/types/components";
import type { TimelineEvent } from "@/app/types/events";
import { TIMELINE_MAX_YEAR, TIMELINE_MIN_YEAR } from "@/app/lib/constants";
import { formatYear, timelineContext, yearToPercent } from "@/app/lib/timeline-utils";
import { EraBackground } from "./EraBackground";
import { EventMarker } from "./EventMarker";
import { TimeLineControls } from "./TimeLineControls";
import { TimeLineScrubber } from "./TimeLineScrubber";

/** Píxeles por año en cada nivel semántico de zoom. */
export const PX_PER_YEAR: Record<ZoomLevel, number> = {
  era: 0.38,
  century: 1.8,
  decade: 7,
  year: 24,
};

const DOMAIN_YEARS = TIMELINE_MAX_YEAR - TIMELINE_MIN_YEAR;
const LEFT_PADDING_PERCENT = 2.4;
const SPAN_PERCENT = 95.2;
const ZOOM_MIN = 15;
const ZOOM_MAX = 3000;
const LABEL_WIDTH = 170;
const LABEL_GAP = 10;
const LABEL_ROWS = 4;
const LABEL_ROW_STEP = 34;
const VIEWPORT_BUFFER = 420;
const TICK_INTERVAL: Record<ZoomLevel, number> = { era: 500, century: 100, decade: 10, year: 1 };

const clampZoom = (zoom: number): number => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom));

const zoomLevelForSpan = (span: number): ZoomLevel => {
  if (span > 1500) return "era";
  if (span > 300) return "century";
  if (span > 60) return "decade";
  return "year";
};

/** La captura de puntero puede fallar si el puntero ya no está activo. */
const capturePointer = (element: HTMLElement, pointerId: number) => {
  try {
    element.setPointerCapture(pointerId);
  } catch {
    // Sin captura: el arrastre sigue funcionando mientras el puntero permanezca sobre el lienzo.
  }
};

type DragState =
  | { kind: "pan"; pointerId: number; startX: number; startScroll: number; moved: boolean }
  | { kind: "range"; pointerId: number; startX: number; currentX: number; scroll: number };

type PinchState = { distance: number; zoom: number; year: number; offset: number };

export function TimeLineCanvas({
  eras,
  events,
  zoom,
  zoomLevel,
  selectedId,
  focusRange,
  onZoomChange,
  onZoomLevelChange,
  onSelect,
  currentYear,
  isPlaying,
  onYearChange,
  onTogglePlayback,
}: TimelineCanvasWithScrubberProps) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [viewport, setViewport] = useState({ left: 0, width: 0 });
  const [viewportYear, setViewportYear] = useState(currentYear);
  const [selection, setSelection] = useState<{ left: number; width: number } | null>(null);
  const anchorRef = useRef<{ year: number; offset: number } | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<PinchState | null>(null);
  const rafRef = useRef(0);
  const initializedRef = useRef(false);
  const initialRangeAppliedRef = useRef(false);
  const lastCenteredYearRef = useRef(currentYear);

  const timelineWidth = Math.max(containerWidth, PX_PER_YEAR[zoomLevel] * DOMAIN_YEARS * (zoom / 100));

  const xForYear = useCallback((year: number): number => (
    (LEFT_PADDING_PERCENT + yearToPercent(year, TIMELINE_MIN_YEAR, TIMELINE_MAX_YEAR) * (SPAN_PERCENT / 100)) / 100
  ) * timelineWidth, [timelineWidth]);

  const yearForX = useCallback((x: number): number => {
    const percent = (x / Math.max(1, timelineWidth)) * 100;
    return TIMELINE_MIN_YEAR + ((percent - LEFT_PADDING_PERCENT) / SPAN_PERCENT) * DOMAIN_YEARS;
  }, [timelineWidth]);

  const positions = useMemo(() => {
    const map = new Map<string, number>();
    for (const event of events) map.set(event.id, xForYear(event.year));
    return map;
  }, [events, xForYear]);

  /** Nivel semántico: en vista de era solo se muestran los hitos mayores. */
  const levelEvents = useMemo(
    () => events.filter((event) => zoomLevel !== "era" || event.importance === "major"),
    [events, zoomLevel],
  );

  /** Las etiquetas de eventos menores solo se muestran a partir del nivel década. */
  const labelAllowed = useCallback(
    (event: TimelineEvent): boolean => (
      zoomLevel === "era" || zoomLevel === "century" ? event.importance === "major" : true
    ),
    [zoomLevel],
  );

  /** Colocación de etiquetas: se apilan en filas mientras no se solapen en píxeles. */
  const { offsets, hiddenLabels } = useMemo(() => {
    const labelOffsets = new Map<string, number>();
    const hidden = new Set<string>();
    for (const lane of ["biblical", "world"] as const) {
      const laneEvents = levelEvents
        .filter((event) => event.lane === lane && labelAllowed(event))
        .sort((a, b) => (positions.get(a.id) ?? 0) - (positions.get(b.id) ?? 0));
      const rowEnds: number[] = [];
      for (const event of laneEvents) {
        const x = positions.get(event.id) ?? 0;
        let row = rowEnds.findIndex((end) => x - LABEL_WIDTH / 2 >= end + LABEL_GAP);
        if (row === -1) {
          if (rowEnds.length >= LABEL_ROWS) {
            hidden.add(event.id);
            continue;
          }
          row = rowEnds.length;
          rowEnds.push(-Infinity);
        }
        rowEnds[row] = x + LABEL_WIDTH / 2;
        labelOffsets.set(event.id, row * LABEL_ROW_STEP);
      }
    }
    return { offsets: labelOffsets, hiddenLabels: hidden };
  }, [labelAllowed, levelEvents, positions]);

  /** Virtualización: solo se montan los eventos dentro del viewport más un margen. */
  const renderedEvents = useMemo(() => {
    if (!viewport.width) return levelEvents;
    return levelEvents.filter((event) => {
      const x = positions.get(event.id);
      if (x === undefined) return false;
      return x >= viewport.left - VIEWPORT_BUFFER && x <= viewport.left + viewport.width + VIEWPORT_BUFFER;
    });
  }, [levelEvents, positions, viewport.left, viewport.width]);

  /** La etiqueta se mantiene dentro del lienzo para que no quede cortada en los extremos. */
  const labelPosition = useCallback((x: number): number => (
    Math.min(Math.max(x, LABEL_WIDTH / 2 + 4), Math.max(LABEL_WIDTH / 2 + 4, timelineWidth - LABEL_WIDTH / 2 - 4))
  ), [timelineWidth]);

  const ticks = useMemo(() => {
    const interval = TICK_INTERVAL[zoomLevel];
    const left = Math.max(0, viewport.left - 120);
    const right = viewport.width ? viewport.left + viewport.width + 120 : timelineWidth;
    if (right <= left) return [];
    const startYear = Math.max(TIMELINE_MIN_YEAR, Math.ceil(yearForX(left) / interval) * interval);
    const endYear = Math.min(TIMELINE_MAX_YEAR, Math.floor(yearForX(right) / interval) * interval);
    const labelEvery = zoomLevel === "year" ? 10 : 1;
    const result: { year: number; x: number; label: string | null }[] = [];
    let count = 0;
    for (let year = startYear; year <= endYear && count < 240; year += interval) {
      count += 1;
      result.push({
        year,
        x: xForYear(year),
        label: Math.round(year / interval) % labelEvery === 0 ? formatYear(year) : null,
      });
    }
    return result;
  }, [timelineWidth, viewport.left, viewport.width, xForYear, yearForX, zoomLevel]);

  useEffect(() => {
    const container = scrollContainer.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? container.clientWidth;
      setContainerWidth(width);
      setViewport({ left: container.scrollLeft, width: container.clientWidth });
    });
    observer.observe(container);
    setContainerWidth(container.clientWidth);
    setViewport({ left: container.scrollLeft, width: container.clientWidth });
    return () => observer.disconnect();
  }, []);

  const centerOnYear = useCallback((year: number, container: HTMLDivElement) => {
    const max = Math.max(0, container.scrollWidth - container.clientWidth);
    container.scrollLeft = Math.min(max, Math.max(0, xForYear(year) - container.clientWidth / 2));
  }, [xForYear]);

  const applyRange = useCallback((startYear: number, endYear: number, container: HTMLDivElement) => {
    const span = Math.max(2, endYear - startYear);
    const level = zoomLevelForSpan(span);
    const targetZoom = clampZoom((container.clientWidth / (PX_PER_YEAR[level] * span)) * 100 * 0.94);
    anchorRef.current = { year: startYear, offset: container.clientWidth * 0.03 };
    onZoomLevelChange(level);
    onZoomChange(targetZoom);
  }, [onZoomChange, onZoomLevelChange]);

  useEffect(() => {
    if (initializedRef.current || !containerWidth || focusRange) return;
    initializedRef.current = true;
    const container = scrollContainer.current;
    if (container) centerOnYear(currentYear, container);
  }, [centerOnYear, containerWidth, currentYear, focusRange]);

  useEffect(() => {
    if (!focusRange || initialRangeAppliedRef.current || !containerWidth) return;
    initialRangeAppliedRef.current = true;
    const container = scrollContainer.current;
    if (container) applyRange(focusRange.startYear, focusRange.endYear, container);
  }, [applyRange, containerWidth, focusRange]);

  useEffect(() => {
    const anchor = anchorRef.current;
    anchorRef.current = null;
    const container = scrollContainer.current;
    if (!anchor || !container) return;
    const max = Math.max(0, container.scrollWidth - container.clientWidth);
    container.scrollLeft = Math.min(max, Math.max(0, xForYear(anchor.year) - anchor.offset));
  }, [timelineWidth, xForYear]);

  useEffect(() => {
    if (lastCenteredYearRef.current === currentYear) return;
    lastCenteredYearRef.current = currentYear;
    const container = scrollContainer.current;
    if (!container || !container.clientWidth) return;
    centerOnYear(currentYear, container);
  }, [centerOnYear, currentYear]);

  useEffect(() => {
    const container = scrollContainer.current;
    if (!container) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) {
        const rect = container.getBoundingClientRect();
        const cursorX = event.clientX - rect.left;
        const year = yearForX(container.scrollLeft + cursorX);
        anchorRef.current = { year, offset: cursorX };
        onZoomChange(clampZoom(zoom * Math.exp(-event.deltaY * 0.0016)));
        return;
      }
      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      container.scrollLeft += delta;
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [onZoomChange, yearForX, zoom]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      setViewport({ left: container.scrollLeft, width: container.clientWidth });
      setViewportYear(yearForX(container.scrollLeft + container.clientWidth / 2));
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollContainer.current;
    if (!container) return;
    const target = event.target as HTMLElement;
    const isControl = Boolean(target.closest("button, a, input, select, label"));

    if (event.pointerType === "touch") {
      pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointersRef.current.size === 2) {
        const [a, b] = [...pointersRef.current.values()];
        const rect = container.getBoundingClientRect();
        const midX = (a.x + b.x) / 2 - rect.left;
        pinchRef.current = {
          distance: Math.hypot(a.x - b.x, a.y - b.y),
          zoom,
          year: yearForX(container.scrollLeft + midX),
          offset: midX,
        };
        dragRef.current = null;
        setSelection(null);
        return;
      }
    }

    if (isControl) return;
    const rect = container.getBoundingClientRect();

    if (event.shiftKey) {
      const x = event.clientX - rect.left;
      dragRef.current = { kind: "range", pointerId: event.pointerId, startX: x, currentX: x, scroll: container.scrollLeft };
      setSelection({ left: container.scrollLeft + x, width: 0 });
      capturePointer(container, event.pointerId);
      event.preventDefault();
      return;
    }

    dragRef.current = { kind: "pan", pointerId: event.pointerId, startX: event.clientX, startScroll: container.scrollLeft, moved: false };
    capturePointer(container, event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollContainer.current;
    if (!container) return;

    if (event.pointerType === "touch" && pointersRef.current.has(event.pointerId)) {
      pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointersRef.current.size === 2 && pinchRef.current) {
        const [a, b] = [...pointersRef.current.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        const ratio = distance / pinchRef.current.distance;
        anchorRef.current = { year: pinchRef.current.year, offset: pinchRef.current.offset };
        onZoomChange(clampZoom(pinchRef.current.zoom * ratio));
        event.preventDefault();
        return;
      }
    }

    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (drag.kind === "pan") {
      const delta = event.clientX - drag.startX;
      if (Math.abs(delta) > 3) {
        drag.moved = true;
        container.scrollLeft = drag.startScroll - delta;
      }
      return;
    }

    const rect = container.getBoundingClientRect();
    const x = Math.min(Math.max(0, event.clientX - rect.left), container.clientWidth);
    drag.currentX = x;
    setSelection({ left: container.scrollLeft + Math.min(drag.startX, x), width: Math.abs(x - drag.startX) });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    const container = scrollContainer.current;
    if (!container || drag.kind !== "range") return;
    const x1 = Math.min(drag.startX, drag.currentX);
    const x2 = Math.max(drag.startX, drag.currentX);
    setSelection(null);
    if (x2 - x1 < 24) return;
    applyRange(yearForX(drag.scroll + x1), yearForX(drag.scroll + x2), container);
  };

  const handleZoomLevelChange = (level: ZoomLevel) => {
    const container = scrollContainer.current;
    if (container && container.clientWidth) {
      const centerYear = yearForX(container.scrollLeft + container.clientWidth / 2);
      anchorRef.current = { year: centerYear, offset: container.clientWidth / 2 };
    }
    onZoomLevelChange(level);
  };

  const handleFitAll = () => {
    const container = scrollContainer.current;
    if (!container || !container.clientWidth) return;
    anchorRef.current = { year: TIMELINE_MIN_YEAR, offset: 0 };
    onZoomLevelChange("era");
    onZoomChange(clampZoom((container.clientWidth / (PX_PER_YEAR.era * DOMAIN_YEARS)) * 100));
  };

  const handleFocusSelected = () => {
    const container = scrollContainer.current;
    if (!container || !container.clientWidth) return;
    const event = events.find((candidate) => candidate.id === selectedId);
    if (!event) return;
    anchorRef.current = { year: event.year, offset: container.clientWidth / 2 };
    onZoomLevelChange("decade");
    onZoomChange(clampZoom((container.clientWidth / (PX_PER_YEAR.decade * 50)) * 100));
    onYearChange(event.year);
  };

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-(--background-primary)">
      <div className="pointer-events-none absolute left-[8%] top-8 z-1 whitespace-nowrap font-(--font-primary) text-[clamp(72px,12vw,160px)] leading-none tracking-[-.04em] text-[rgba(17,17,17,.06)]">
        {timelineContext(viewportYear)}
      </div>
      <div className="pointer-events-none absolute left-4 top-4 z-4 bg-(--background-primary) px-2 font-mono text-[11px] uppercase tracking-widest text-[rgba(17,17,17,.4)]">
        Narrativa bíblica
      </div>
      <div className="pointer-events-none absolute bottom-14 left-4 z-4 bg-(--background-primary) px-2 font-mono text-[11px] uppercase tracking-widest text-[rgba(17,17,17,.4)]">
        Contexto mundial
      </div>
      <div
        ref={scrollContainer}
        className="h-full min-h-0 w-full cursor-grab overflow-x-auto overflow-y-hidden active:cursor-grabbing"
        style={{ touchAction: "pan-y" }}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        data-total-events={events.length}
        data-rendered-events={renderedEvents.length}
        data-timeline-width={Math.round(timelineWidth)}
        data-zoom-level={zoomLevel}
        data-zoom={Math.round(zoom)}
      >
        <div className="relative h-full min-h-0 w-full" style={{ minWidth: `${timelineWidth}px` }}>
          {eras.map((era) => (
            <EraBackground
              key={era.id}
              era={era}
              left={xForYear(era.startYear)}
              width={xForYear(era.endYear) - xForYear(era.startYear)}
            />
          ))}
          <div
            className="absolute top-0 bottom-12 z-1 w-px bg-(--category-prophetic) opacity-70"
            style={{ left: `${xForYear(currentYear)}px` }}
            aria-label={`Año actual: ${currentYear}`}
          />
          <div className="absolute left-0 right-0 top-[60%] h-0.5 bg-(--text-ink)" />
          <div className="absolute left-0 right-0 top-[60%] h-4">
            {ticks.map((tick) => (
              <span className="absolute" style={{ left: `${tick.x}px` }} key={tick.year}>
                <span className="block h-3 w-0.5 -translate-x-1/2 bg-(--text-ink)" aria-hidden="true" />
                {tick.label &&
                  <span className="absolute left-0 top-3 -translate-x-1/2 font-mono text-[9px] whitespace-nowrap text-(--text-muted)">
                    {tick.label}
                  </span>
                }
              </span>
            ))}
          </div>
          <div className="absolute inset-x-0 top-0 h-[60%]">
            {renderedEvents.filter((event) => event.lane === "biblical").map((event) => (
              <EventMarker
                key={event.id}
                event={event}
                x={positions.get(event.id) ?? 0}
                labelX={labelPosition(positions.get(event.id) ?? 0)}
                verticalOffset={offsets.get(event.id)}
                selected={selectedId === event.id}
                showLabel={!hiddenLabels.has(event.id) && labelAllowed(event)}
                onSelect={onSelect}
              />
            ))}
          </div>
          <div className="absolute inset-x-0 top-[60%] h-[38%]">
            {renderedEvents.filter((event) => event.lane === "world").map((event) => (
              <EventMarker
                key={event.id}
                event={event}
                x={positions.get(event.id) ?? 0}
                labelX={labelPosition(positions.get(event.id) ?? 0)}
                verticalOffset={offsets.get(event.id)}
                selected={selectedId === event.id}
                showLabel={!hiddenLabels.has(event.id) && labelAllowed(event)}
                onSelect={onSelect}
              />
            ))}
          </div>
          {selection &&
            <div
              className="pointer-events-none absolute inset-y-0 z-3 border-x-2 border-(--category-conflict) bg-[rgba(215,38,56,.12)]"
              style={{ left: `${selection.left}px`, width: `${selection.width}px` }}
              aria-hidden="true"
            />
          }
        </div>
      </div>
      <TimeLineControls
        zoomLevel={zoomLevel}
        zoom={zoom}
        canFocusSelected={Boolean(selectedId)}
        onZoomLevelChange={handleZoomLevelChange}
        onFitAll={handleFitAll}
        onFocusSelected={handleFocusSelected}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-3">
        <div className="pointer-events-auto">
          <TimeLineScrubber
            currentYear={currentYear}
            minYear={TIMELINE_MIN_YEAR}
            maxYear={TIMELINE_MAX_YEAR}
            isPlaying={isPlaying}
            onYearChange={onYearChange}
            onTogglePlayback={onTogglePlayback}
          />
        </div>
      </div>
    </div>
  );
}
