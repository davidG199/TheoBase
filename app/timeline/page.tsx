"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/app/components/layout/Navbar";
import Timeline from "./components/Timeline";
import { SearchMatrix } from "@/app/components/search/SearchMatrix";
import { eras } from "@/app/data/eras";
import { biblicalEvents } from "@/app/data/events/biblical";
import { worldEvents } from "@/app/data/events/world";
import { timelineEvents } from "@/app/lib/timeline-utils";
import { buildFixtureEvents } from "./fixtures";
import type { TimelineEvent, TimelineFilter, EventCategory, TimelineCertainty, TimelineEvidence, TimelineChronology } from "@/app/types/events";
import type { TimelineEra } from "@/app/types/era";

export default function TimeLinePage() {
  return <Suspense fallback={
    <div className="min-h-screen bg-(--background-primary)" aria-label="Cargando línea temporal" />
    }>
    <TimeLinePageContent />
    </Suspense>;
}

function TimeLinePageContent() {
  const searchParams = useSearchParams();

  // Initialize state from URL params (lazy initialization)
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [searchOpen, setSearchOpen] = useState(() => searchParams.has("search") || searchParams.has("q") || searchParams.has("cat") || searchParams.has("from") || searchParams.has("to") || searchParams.has("cert") || searchParams.has("evid") || searchParams.has("chrono") || searchParams.has("src"));
  const [focusEventId, setFocusEventId] = useState<string | undefined>(() => searchParams.get("event") ?? undefined);
  const [activeFigure, setActiveFigure] = useState<string | undefined>(() => searchParams.get("figure") ?? undefined);
  const [lane, setLane] = useState<TimelineFilter>(() => (searchParams.get("lane") as TimelineFilter) ?? "all");
  const [category, setCategory] = useState<EventCategory | "all">(() => (searchParams.get("cat") as EventCategory | "all") ?? "all");
  const [fromYear, setFromYear] = useState(() => searchParams.get("from") ?? "");
  const [toYear, setToYear] = useState(() => searchParams.get("to") ?? "");
  const [certainty, setCertainty] = useState<TimelineCertainty | "all">(() => (searchParams.get("cert") as TimelineCertainty | "all") ?? "all");
  const [evidence, setEvidence] = useState<TimelineEvidence | "all">(() => (searchParams.get("evid") as TimelineEvidence | "all") ?? "all");
  const [chronology, setChronology] = useState<TimelineChronology | "all">(() => (searchParams.get("chrono") as TimelineChronology | "all") ?? "all");
  const [sourceQuery, setSourceQuery] = useState(() => searchParams.get("src") ?? "");
  const [focusEraId, setFocusEraId] = useState<string | undefined>(() => searchParams.get("era") ?? undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_setCategory, _setFromYear, _setToYear, _setCertainty, _setEvidence, _setChronology, _setSourceQuery] = [
    setCategory, setFromYear, setToYear, setCertainty, setEvidence, setChronology, setSourceQuery,
  ];
  const fixtureCount = process.env.NODE_ENV === "production"
    ? 0
    : Math.min(5000, Math.max(0, Number(searchParams.get("fixtures") ?? 0) || 0));

  const events = useMemo(
    () => (fixtureCount > 0 ? buildFixtureEvents(fixtureCount) : timelineEvents([...biblicalEvents, ...worldEvents])),
    [fixtureCount],
  );

  const focusEra = eras.find((era) => era.id === focusEraId);
  const figureEvents = useMemo(
    () => (activeFigure ? events.filter((event) => event.figures?.includes(activeFigure)) : []),
    [activeFigure, events],
  );
  const focusYear = focusEra
    ? Math.round((focusEra.startYear + focusEra.endYear) / 2)
    : figureEvents[0]?.year;
  const timelineKey = `${focusEventId ?? ""}-${focusEra?.id ?? ""}-${activeFigure ?? ""}`;

  /** Intervalo que debe encuadrar la vista al montarse. */
  const focusRange = useMemo(() => {
    if (figureEvents.length > 0) {
      const years = figureEvents.map((event) => event.year);
      const first = Math.min(...years);
      const last = Math.max(...years);
      return { startYear: first - 5, endYear: last + 5 };
    }
    if (focusEra) return { startYear: focusEra.startYear, endYear: focusEra.endYear };
    const focusedEvent = focusEventId ? events.find((event) => event.id === focusEventId) : undefined;
    if (focusedEvent) return { startYear: focusedEvent.year - 25, endYear: focusedEvent.year + 25 };
    return undefined;
  }, [events, figureEvents, focusEra, focusEventId]);

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (searchOpen) params.set("search", "1");
    if (focusEventId) params.set("event", focusEventId);
    if (activeFigure) params.set("figure", activeFigure);
    if (lane !== "all") params.set("lane", lane);
    if (category !== "all") params.set("cat", category);
    if (fromYear) params.set("from", fromYear);
    if (toYear) params.set("to", toYear);
    if (certainty !== "all") params.set("cert", certainty);
    if (evidence !== "all") params.set("evid", evidence);
    if (chronology !== "all") params.set("chrono", chronology);
    if (sourceQuery) params.set("src", sourceQuery);
    if (focusEraId) params.set("era", focusEraId);
    if (fixtureCount) params.set("fixtures", String(fixtureCount));
    const newUrl = `/timeline?${params.toString()}`;
    if (window.location.pathname + window.location.search !== newUrl) {
      window.history.replaceState({}, "", newUrl);
    }
  }, [query, searchOpen, focusEventId, activeFigure, lane, category, fromYear, toYear, certainty, evidence, chronology, sourceQuery, focusEraId, fixtureCount]);

  // Sync state -> URL on any change
  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  const closeSearch = () => {
    setQuery("");
    setSearchOpen(false);
  };

  const selectEvent = (event: TimelineEvent) => {
    setFocusEraId(undefined);
    setActiveFigure(undefined);
    setFocusEventId(event.id);
    closeSearch();
  };

  const selectEra = (era: TimelineEra) => {
    setFocusEventId(undefined);
    setActiveFigure(undefined);
    setFocusEraId(era.id);
    closeSearch();
  };

  const selectFigure = (figure: string) => {
    setFocusEventId(undefined);
    setFocusEraId(undefined);
    setActiveFigure(figure);
    closeSearch();
  };

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-(--background-primary)">
      <Navbar query={query} onQueryChange={setQuery} onSearchOpen={() => setSearchOpen(true)} lane={lane} onLaneChange={setLane} />
      {activeFigure &&
        <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-(--text-ink) bg-(--surface-pure) px-4 py-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-(--text-muted)">
            Figura
          </span>
          <strong className="text-xs uppercase tracking-[.04em]">
            {activeFigure}
          </strong>
          <span className="font-mono text-[10px] text-(--text-muted)">
            {figureEvents.length === 1 ? "1 evento" : `${figureEvents.length} eventos`}
          </span>
          <button
            type="button"
            className="ml-auto cursor-pointer border border-(--text-ink) bg-(--surface-pure) px-2 py-1 font-mono text-[10px] uppercase tracking-[.05em] shadow-[2px_2px_0_var(--text-ink)]"
            onClick={() => setActiveFigure(undefined)}
          >
            Quitar filtro
          </button>
        </div>
      }
      <Timeline
        key={timelineKey}
        events={events}
        query={query}
        lane={lane}
        focusEventId={focusEventId}
        focusYear={focusYear}
        focusFigure={activeFigure}
        focusRange={focusRange}
      />
      {searchOpen &&
        <SearchMatrix
          query={query}
          eras={eras}
          events={events}
          onQueryChange={setQuery}
          onClose={() => setSearchOpen(false)}
          onSelectEvent={selectEvent}
          onSelectEra={selectEra}
          onSelectFigure={selectFigure}
          category={category}
          fromYear={fromYear ? Number(fromYear) : undefined}
          toYear={toYear ? Number(toYear) : undefined}
          certainty={certainty}
          evidence={evidence}
          chronology={chronology}
          sourceQuery={sourceQuery}
        />
      }
    </div>
  );
}
