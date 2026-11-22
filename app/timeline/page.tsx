"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/app/components/layout/Navbar";
import Timeline from "./components/Timeline";
import { SearchMatrix } from "@/app/components/search/SearchMatrix";
import { eras } from "@/app/data/eras";
import { biblicalEvents } from "@/app/data/events/biblical";
import { worldEvents } from "@/app/data/events/world";
import { timelineEvents } from "@/app/lib/timeline-utils";
import type { TimelineEvent, TimelineFilter } from "@/app/types/events";

export default function TimeLinePage() {
  return <Suspense fallback={
    <div className="min-h-screen bg-(--background-primary)" aria-label="Cargando línea temporal" />
    }>
    <TimeLinePageContent />
    </Suspense>;
}

function TimeLinePageContent() {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [focusEventId, setFocusEventId] = useState<string>();
  const [lane, setLane] = useState<TimelineFilter>("all");
  const searchParams = useSearchParams();
  const events = timelineEvents([...biblicalEvents, ...worldEvents]);
  const focusEra = eras.find((era) => era.id === searchParams.get("era"));

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-(--background-primary)">
      <Navbar query={query} onQueryChange={setQuery} onSearchOpen={() => setSearchOpen(true)} lane={lane} onLaneChange={setLane} />
      <Timeline 
        key={focusEventId ?? focusEra?.id ?? "timeline"} 
        query={query} 
        lane={lane} 
        focusEventId={focusEventId} 
        focusYear={focusEra ? Math.round((focusEra.startYear + focusEra.endYear) / 2) : undefined} 
      />
      {searchOpen && <SearchMatrix query={query} eras={eras} events={events} onQueryChange={setQuery} onClose={() => setSearchOpen(false)} onSelectEvent={(event: TimelineEvent) => {
        setFocusEventId(event.id);
        setQuery("");
        setSearchOpen(false);
      }} />}
    </div>
  );
}

