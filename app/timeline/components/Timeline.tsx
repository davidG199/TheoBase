"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { eras } from "@/app/data/eras";
import { eventMatchesQuery, eraForYear, timelineEvents } from "@/app/lib/timeline-utils";
import { TIMELINE_MAX_YEAR, TIMELINE_MIN_YEAR } from "@/app/lib/constants";
import type { TimelineEvent } from "@/app/types/events";
import type { TimelineProps, ZoomLevel } from "@/app/types/components";
import { TimeLineCanvas } from "./TimeLineCanvas";
import { ContextPanel } from "./ContextPanel";

export default function Timeline({ events, query, lane, focusEventId, focusYear, focusFigure, focusRange }: TimelineProps) {
  const [zoom, setZoom] = useState(100);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>("era");
  const [playbackSpeed, setPlaybackSpeed] = useState(100);
  const allEvents = useMemo(() => timelineEvents(events), [events]);
  const initialEvent = focusEventId ? allEvents.find((event) => event.id === focusEventId) ?? null : null;
  const [selected, setSelected] = useState<TimelineEvent | null>(initialEvent);
  const focusEra = focusYear !== undefined ? eraForYear(eras, focusYear) : undefined;
  const initialEra = (initialEvent && eraForYear(eras, initialEvent.year)) ?? focusEra ?? eras[0];
  const [selectedEra, setSelectedEra] = useState(initialEra);
  const [currentYear, setCurrentYear] = useState(focusYear ?? initialEvent?.year ?? TIMELINE_MIN_YEAR);
  const [isPlaying, setIsPlaying] = useState(false);

  const visibleEvents = useMemo(() => allEvents.filter((event) => {
    const matchesFilter = lane === "all"
      || event.lane === lane
      || (lane === "conflict" && event.category === "conflict")
      || (lane === "prophecy" && event.category === "prophetic")
      || (lane === "royalty" && event.category === "sovereign");
    const matchesFigure = !focusFigure || event.figures?.includes(focusFigure);
    return matchesFilter && matchesFigure && eventMatchesQuery(event, query);
  }), [allEvents, focusFigure, lane, query]);

  const timelineYear = Math.min(TIMELINE_MAX_YEAR, Math.max(TIMELINE_MIN_YEAR, currentYear));

  const isInitialMount = useRef(true);

  // Sync selected event when focusEventId prop changes (e.g., from URL)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (focusEventId) {
      const event = allEvents.find((e) => e.id === focusEventId);
      if (event) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelected(event);
        const eventEra = eraForYear(eras, event.year);
        if (eventEra) setSelectedEra(eventEra);
      }
    } else {
      setSelected(null);
    }
  }, [focusEventId, allEvents]);

  useEffect(() => {
    if (!isPlaying) return;
    const step = playbackSpeed;
    const timer = window.setInterval(() => setCurrentYear((year) => (
      year >= TIMELINE_MAX_YEAR ? TIMELINE_MIN_YEAR : Math.min(TIMELINE_MAX_YEAR, year + step)
    )), 350);
    return () => window.clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  const handleSelect = (event: TimelineEvent) => {
    setSelected(event);
    setIsPlaying(false); // R4.3: Pausar al seleccionar
    const eventEra = eraForYear(eras, event.year);
    if (eventEra) setSelectedEra(eventEra);
  };

  const handleRestart = () => {
    setCurrentYear(TIMELINE_MIN_YEAR);
    setIsPlaying(false);
    setZoomLevel("era");
    setZoom(100);
  };

  const handleJumpTo = (target: { type: "era"; eraId: string } | { type: "year"; year: number } | { type: "event"; eventId: string }) => {
    if (target.type === "year") {
      setCurrentYear(target.year);
    } else if (target.type === "era") {
      const era = eras.find((e) => e.id === target.eraId);
      if (era) {
        const midYear = Math.round((era.startYear + era.endYear) / 2);
        setCurrentYear(midYear);
      }
    } else if (target.type === "event") {
      const event = allEvents.find((e) => e.id === target.eventId);
      if (event) {
        setCurrentYear(event.year);
      }
    }
  };

  return <main className="relative min-h-0 w-full flex-1 overflow-hidden">
    <section className="relative h-full min-h-0 w-full overflow-hidden" aria-label={`Línea de tiempo, ${visibleEvents.length} acontecimientos visibles`}>
      <TimeLineCanvas
        eras={eras}
        events={visibleEvents}
        zoom={zoom}
        zoomLevel={zoomLevel}
        currentYear={timelineYear}
        isPlaying={isPlaying}
        selectedId={selected?.id}
        focusRange={focusRange}
        onZoomChange={setZoom}
        onYearChange={setCurrentYear}
        onTogglePlayback={() => setIsPlaying((playing) => !playing)}
        onZoomLevelChange={(level) => {
          setZoomLevel(level);
          setZoom(100);
        }}
        onSelect={handleSelect}
        playbackSpeed={playbackSpeed}
        onSpeedChange={setPlaybackSpeed}
        onJumpTo={handleJumpTo}
        onRestart={handleRestart}
        showConnectors={true}
        highlightSync={true}
      />
      {selected &&
        <>
          <div className="absolute inset-0 z-4 bg-[rgba(17,17,17,.14)]" onClick={() => setSelected(null)} />
          <ContextPanel
            event={selected}
            eras={eras}
            selectedEra={selectedEra}
            onClose={() => setSelected(null)}
            onEraChange={(eraId) => setSelectedEra(eras.find((era) => era.id === eraId) ?? eras[0])}
            allEvents={allEvents}
            onNavigateEvent={(relatedEvent) => {
              setSelected(relatedEvent);
              setIsPlaying(false);
              const relatedEra = eraForYear(eras, relatedEvent.year);
              if (relatedEra) setSelectedEra(relatedEra);
            }}
          />
        </>
      }
    </section>
  </main>;
}