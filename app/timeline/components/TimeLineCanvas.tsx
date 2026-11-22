import { useEffect, useRef, useState } from "react";
import type { TimelineCanvasWithScrubberProps } from "@/app/types/components";
import type { TimelineEvent } from "@/app/types/events";
import { eventPosition, timelineBounds, timelineContext } from "@/app/lib/timeline-utils";
import { EraBackground } from "./EraBackground";
import { EventMarker } from "./EventMarker";
import { TimeLineControls } from "./TimeLineControls";
import { TimeLineScrubber } from "./TimeLineScrubber";

const verticalOffsetsFor = (events: TimelineEvent[], minYear: number, maxYear: number): Map<string, number> => {
  const offsets = new Map<string, number>();
  const levels = 6;
  const step = 28;

  for (const lane of ["biblical", "world"] as const) {
    const laneEvents = events.filter((event) => event.lane === lane).sort((a, b) => a.year - b.year);
    laneEvents.forEach((event, index) => {
      const position = eventPosition(event, minYear, maxYear);
      const used = new Set(
        laneEvents
          .slice(0, index)
          .filter((previous) => Math.abs(eventPosition(previous, minYear, maxYear) - position) < 9)
          .map((previous) => offsets.get(previous.id) ?? 0),
      );
      let offset = 0;
      for (let level = 0; level < levels; level += 1) {
        const candidate = level * step;
        if (!used.has(candidate)) {
          offset = candidate;
          break;
        }
      }
      offsets.set(event.id, offset);
    });
  }
  return offsets;
};

const eventPositionsFor = (events: TimelineEvent[], minYear: number, maxYear: number): Map<string, number> => {
  const positions = new Map<string, number>();
  const eventsByYear = new Map<number, TimelineEvent[]>();

  for (const event of events) {
    const sameYear = eventsByYear.get(event.year) ?? [];
    sameYear.push(event);
    eventsByYear.set(event.year, sameYear);
  }

  for (const sameYearEvents of eventsByYear.values()) {
    const center = eventPosition(sameYearEvents[0], minYear, maxYear);
    sameYearEvents.forEach((event) => positions.set(event.id, center));
  }

  return positions;
};

export function TimeLineCanvas({
  eras,
  events,
  zoom,
  zoomLevel,
  selectedId,
  onZoomChange,
  onZoomLevelChange,
  onSelect,
  currentYear,
  isPlaying,
  onYearChange,
  onTogglePlayback,
}: TimelineCanvasWithScrubberProps) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const { minYear, maxYear } = timelineBounds(events);
  const yearSpan = Math.max(1, maxYear - minYear);
  const precisionScale = { era: 1, century: 1.45, decade: 2, year: 2.7 }[zoomLevel];
  const eventSpacingWidth = Math.max(0, events.length - 1) * 190 + 240;
  const timelineWidth = Math.max(yearSpan * 0.6 * Math.max(zoom, 100) / 100, eventSpacingWidth * precisionScale);
  const currentYearPosition = ((currentYear - minYear) / yearSpan) * 100;
  const [viewportYear, setViewportYear] = useState(currentYear);
  const yearMarks = Array.from({ length: 6 }, (_, index) => {
    const left = (index / 5) * 100;
    const year = Math.round(minYear + (yearSpan * index) / 5);
    return { label: year < 0 ? `${Math.abs(year)} a.C.` : `${year} d.C.`, left };
  });
  const verticalOffsets = verticalOffsetsFor(events, minYear, maxYear);
  const eventPositions = eventPositionsFor(events, minYear, maxYear);
  const handleYearChange = (year: number) => {
    onYearChange(year);
    const container = scrollContainer.current;
    if (!container) return;
    const progress = (year - minYear) / yearSpan;
    container.scrollLeft = progress * (container.scrollWidth - container.clientWidth);
  };

  useEffect(() => {
    const container = scrollContainer.current;
    if (!container) return;
    const progress = (currentYear - minYear) / yearSpan;
    container.scrollLeft = progress * (container.scrollWidth - container.clientWidth);
  }, [currentYear, minYear, yearSpan, zoom]);

  useEffect(() => {
    setViewportYear(currentYear);
  }, [currentYear]);

  return <div className="relative h-full min-h-0 w-full overflow-hidden bg-(--background-primary)">
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
      className="h-full min-h-0 w-full overflow-x-auto overflow-y-hidden" 
      onScroll={(event) => 
        {
          const container = event.currentTarget;
          const progress = (container.scrollLeft + container.clientWidth / 2) / Math.max(1, container.scrollWidth);
          setViewportYear(minYear + progress * yearSpan);
        }} onWheel={(event) => 
          {event.preventDefault();
            if (event.ctrlKey || event.metaKey) {
              onZoomChange(Math.max(70, Math.min(140, zoom - Math.sign(event.deltaY) * 5)));
              return;
            }
          if (scrollContainer.current) scrollContainer.current.scrollLeft += event.deltaY || event.deltaX;
    }}>
      <div className="relative h-full min-h-0 w-full" style={{ minWidth: `${timelineWidth}px` }}>
        {eras.map((era) => 
          <EraBackground 
            key={era.id} 
            era={era} 
          />
        )}
        <div className="absolute top-0 bottom-12 z-1 w-px bg-(--category-prophetic) opacity-70" style={{ left: `${currentYearPosition}%` }} aria-label={`Año actual: ${currentYear}`} 
        />
        <div className="absolute left-0 right-0 top-[60%] h-0.5 bg-(--text-ink)" />
        <div className="absolute left-0 right-0 top-[60%] h-3">
          {yearMarks.map((mark) => 
            <span className="absolute h-3 w-0.5 -translate-x-1/2 bg-(--text-ink)" style={{ left: `${mark.left}%` }} key={`${mark.label}-${mark.left}`} aria-label={mark.label} 
            />
          )}
        </div>
        <div className="absolute inset-x-0 top-0 h-[60%]">
          {events.filter((event) => 
            event.lane === "biblical").map((event) => 
              <EventMarker 
                key={event.id} 
                event={event} 
                left={eventPositions.get(event.id) ?? eventPosition(event, minYear, maxYear)} 
                verticalOffset={verticalOffsets.get(event.id)} 
                selected={selectedId === event.id} 
                onSelect={onSelect} />
              )}
        </div>
        <div className="absolute inset-x-0 top-[60%] h-[38%]">
          {events.filter((event) => 
            event.lane === "world").map((event) => 
            <EventMarker 
              key={event.id} 
              event={event} 
              left={eventPositions.get(event.id) ?? eventPosition(event, minYear, maxYear)} 
              verticalOffset={verticalOffsets.get(event.id)} 
              selected={selectedId === event.id} 
              onSelect={onSelect} />
            )}
        </div>
      </div>
    </div>
    <TimeLineControls 
      zoomLevel={zoomLevel} 
      onZoomLevelChange={onZoomLevelChange} 
    />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-3">
      <div className="pointer-events-auto">
        <TimeLineScrubber 
          currentYear={currentYear} 
          minYear={minYear} 
          maxYear={maxYear} 
          isPlaying={isPlaying} 
          onYearChange={handleYearChange} 
          onTogglePlayback={onTogglePlayback} 
        />
      </div>
    </div>
  </div>;
}
