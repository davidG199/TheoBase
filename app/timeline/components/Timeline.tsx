"use client";

import { useEffect, useMemo, useState } from "react";
import { eras } from "@/app/data/eras";
import { biblicalEvents } from "@/app/data/events/biblical";
import { worldEvents } from "@/app/data/events/world";
import { eventMatchesQuery, timelineBounds, timelineEvents } from "@/app/lib/timeline-utils";
import type { TimelineEvent } from "@/app/types/events";
import type { TimelineProps, ZoomLevel } from "@/app/types/components";
import { TimeLineCanvas } from "./TimeLineCanvas";
import { ContextPanel } from "./ContextPanel";

const allEvents = timelineEvents([...biblicalEvents, ...worldEvents]);

export default function Timeline({ query, lane, focusEventId, focusYear }: TimelineProps) {
  const [zoom, setZoom] = useState(100);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>("era");
  const initialEvent = focusEventId ? allEvents.find((event) => event.id === focusEventId) ?? null : null;
  const [selected, setSelected] = useState<TimelineEvent | null>(initialEvent);
  const [selectedEra, setSelectedEra] = useState(eras[0]);
  const [currentYear, setCurrentYear] = useState(focusYear ?? initialEvent?.year ?? -4004);
  const [isPlaying, setIsPlaying] = useState(false);

  const visibleEvents = useMemo(() => allEvents.filter((event) => {
    const matchesFilter = lane === "all"
      || event.lane === lane
      || (lane === "conflict" && event.category === "conflict")
      || (lane === "prophecy" && event.category === "prophetic")
      || (lane === "royalty" && event.category === "sovereign");
    return matchesFilter && eventMatchesQuery(event, query);
  }), [lane, query]);
  const { minYear, maxYear } = timelineBounds(visibleEvents);

  const timelineYear = Math.min(maxYear, Math.max(minYear, currentYear));

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => setCurrentYear((year) => year >= maxYear ? minYear : Math.min(maxYear, year + 100)), 350);
    return () => window.clearInterval(timer);
  }, [isPlaying, minYear, maxYear]);

  return <main className="relative h-[calc(100vh-64px)] min-h-0 w-full overflow-hidden">
    <section className="relative h-full min-h-0 w-full overflow-hidden" aria-label={`Línea de tiempo, ${visibleEvents.length} acontecimientos visibles`}>
      <TimeLineCanvas 
        eras={eras} 
        events={visibleEvents} 
        zoom={zoom} 
        zoomLevel={zoomLevel} 
        currentYear={timelineYear} 
        isPlaying={isPlaying} selectedId={selected?.id} 
        onZoomChange={setZoom} 
        onYearChange={setCurrentYear} 
        onTogglePlayback={() => setIsPlaying((playing) => !playing)} 
        onZoomLevelChange={(level) => {
        setZoomLevel(level);
        setZoom({ era: 80, century: 100, decade: 120, year: 140 }[level]);
      }} onSelect={setSelected} 
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
            />
        </>
        }
    </section>
  </main>;
}
