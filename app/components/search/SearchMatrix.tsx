"use client";

import { useEffect, useMemo, useState } from "react";
import type { ResultColumnProps, SearchMatrixProps } from "@/app/types/components";
import type { EventCategory, TimelineCertainty, TimelineEvidence, TimelineChronology } from "@/app/types/events";
import { TIMELINE_MAX_YEAR, TIMELINE_MIN_YEAR } from "@/app/lib/constants";
import { eventMatchesQuery, formatYear, timelineFigures } from "@/app/lib/timeline-utils";

const categories: { value: EventCategory | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "prophetic", label: "Profecía" },
  { value: "conflict", label: "Conflicto" },
  { value: "sovereign", label: "Realeza" },
  { value: "world", label: "Mundial" },
  { value: "council", label: "Concilio" },
  { value: "reform", label: "Reforma" },
  { value: "mission", label: "Misión" },
];

const categoryLabel = new Map(categories.map((item) => [item.value, item.label]));

const certaintyOptions: { value: TimelineCertainty; label: string }[] = [
  { value: "established", label: "Establecida" },
  { value: "approximate", label: "Aproximada" },
  { value: "disputed", label: "Discutida" },
];

const evidenceOptions: { value: TimelineEvidence; label: string }[] = [
  { value: "biblical-text", label: "Texto bíblico" },
  { value: "archaeological", label: "Arqueología" },
  { value: "inscription", label: "Inscripción" },
  { value: "literary", label: "Fuente literaria" },
  { value: "historical-reconstruction", label: "Reconstrucción histórica" },
  { value: "mixed", label: "Evidencia mixta" },
];

const chronologyOptions: { value: TimelineChronology; label: string }[] = [
  { value: "biblical-traditional", label: "Cronología tradicional" },
  { value: "historical", label: "Datación histórica" },
  { value: "mixed", label: "Datación mixta" },
];

const STORAGE_KEY = "theobase-search-history";
const MAX_HISTORY = 10;

export function SearchMatrix({ 
  query, 
  eras, 
  events, 
  onQueryChange, 
  onClose, 
  onSelectEvent, 
  onSelectEra, 
  onSelectFigure,
  category: initialCategory,
  fromYear: initialFromYear,
  toYear: initialToYear,
  certainty: initialCertainty,
  evidence: initialEvidence,
  chronology: initialChronology,
  sourceQuery: initialSourceQuery,
}: SearchMatrixProps) {
  const [category, setCategory] = useState<EventCategory | "all">(initialCategory ?? "all");
  const [fromYear, setFromYear] = useState(initialFromYear !== undefined ? String(initialFromYear) : String(TIMELINE_MIN_YEAR));
  const [toYear, setToYear] = useState(initialToYear !== undefined ? String(initialToYear) : String(TIMELINE_MAX_YEAR));
  const [certainty, setCertainty] = useState<TimelineCertainty | "all">(initialCertainty ?? "all");
  const [evidence, setEvidence] = useState<TimelineEvidence | "all">(initialEvidence ?? "all");
  const [chronology, setChronology] = useState<TimelineChronology | "all">(initialChronology ?? "all");
  const [sourceQuery, setSourceQuery] = useState(initialSourceQuery ?? "");
  const [showAdvanced] = useState(false);
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveToHistory = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...history.filter((h) => h !== q)].slice(0, MAX_HISTORY);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const parsedFrom = fromYear.trim() === "" ? Number.NaN : Number(fromYear);
  const parsedTo = toYear.trim() === "" ? Number.NaN : Number(toYear);
  const rangeIsValid = Number.isFinite(parsedFrom) && Number.isFinite(parsedTo) && parsedFrom <= parsedTo;
  const filterFrom = rangeIsValid ? parsedFrom : TIMELINE_MIN_YEAR;
  const filterTo = rangeIsValid ? parsedTo : TIMELINE_MAX_YEAR;

  const categoryEvents = useMemo(
    () => events.filter((event) => category === "all" || event.category === category),
    [category, events],
  );

  const matches = useMemo(
    () => categoryEvents.filter((event) => {
      const matchesQuery = eventMatchesQuery(event, query) || (sourceQuery && eventMatchesQuery(event, sourceQuery));
      const matchesYear = event.year >= filterFrom && event.year <= filterTo;
      const matchesCertainty = certainty === "all" || event.certainty === certainty;
      const matchesEvidence = evidence === "all" || event.evidenceType === evidence;
      const matchesChronology = chronology === "all" || event.chronology === chronology;
      return matchesQuery && matchesYear && matchesCertainty && matchesEvidence && matchesChronology;
    }),
    [categoryEvents, filterFrom, filterTo, query, sourceQuery, certainty, evidence, chronology],
  );

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matchingEras = eras.filter((era) => (
    !normalizedQuery
    || `${era.name} ${era.dateLabel} ${era.leaders.join(" ")}`.toLocaleLowerCase().includes(normalizedQuery)
  ));
  const allFigures = useMemo(() => timelineFigures(eras, events), [eras, events]);
  const figureEventCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const event of events) {
      for (const figure of event.figures ?? []) {
        counts.set(figure, (counts.get(figure) ?? 0) + 1);
      }
    }
    return counts;
  }, [events]);
  const matchingPeople = allFigures.filter((person) => (
    (figureEventCounts.get(person) ?? 0) > 0
    && (!normalizedQuery || person.toLocaleLowerCase().includes(normalizedQuery))
  ));

  const activeFilters = useMemo(() => {
    const filters: { label: string; clear: () => void }[] = [];
    if (category !== "all") filters.push({ label: `Categoría: ${categoryLabel.get(category)}`, clear: () => setCategory("all") });
    if (certainty !== "all") filters.push({ label: `Certeza: ${certaintyOptions.find(c => c.value === certainty)?.label}`, clear: () => setCertainty("all") });
    if (evidence !== "all") filters.push({ label: `Evidencia: ${evidenceOptions.find(e => e.value === evidence)?.label}`, clear: () => setEvidence("all") });
    if (chronology !== "all") filters.push({ label: `Cronología: ${chronologyOptions.find(c => c.value === chronology)?.label}`, clear: () => setChronology("all") });
    if (sourceQuery) filters.push({ label: `Fuente: "${sourceQuery}"`, clear: () => setSourceQuery("") });
    if (rangeIsValid && (filterFrom !== TIMELINE_MIN_YEAR || filterTo !== TIMELINE_MAX_YEAR)) {
      filters.push({ label: `Rango: ${formatYear(filterFrom)} – ${formatYear(filterTo)}`, clear: () => { setFromYear(String(TIMELINE_MIN_YEAR)); setToYear(String(TIMELINE_MAX_YEAR)); } });
    }
    return filters;
  }, [category, certainty, evidence, chronology, sourceQuery, rangeIsValid, filterFrom, filterTo]);

  const clearAllFilters = () => {
    setCategory("all");
    setCertainty("all");
    setEvidence("all");
    setChronology("all");
    setSourceQuery("");
    setFromYear(String(TIMELINE_MIN_YEAR));
    setToYear(String(TIMELINE_MAX_YEAR));
  };

  return (
    <div className="fixed inset-0 z-20 bg-(--background-primary) p-8 max-[800px]:p-4" role="dialog" aria-modal="true" aria-label="Matriz de búsqueda">
      <div className="mx-auto flex h-full max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b-2 border-(--text-ink) pb-4">
          <span className="font-mono text-[11px] uppercase tracking-[.1em]">
            Matriz de búsqueda
          </span>
          <button className="grid size-11 cursor-pointer place-items-center border border-(--text-ink) bg-(--surface-pure) text-xl md:size-8" aria-label="Cerrar búsqueda" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="mt-4 flex items-center gap-2">
          <input
            autoFocus
            className="flex-1 border-0 border-b-2 border-(--text-ink) bg-transparent px-0 py-3 font-bold text-[clamp(32px,6vw,64px)] tracking-[-2px] outline-none placeholder:text-[clamp(18px,3vw,34px)] placeholder:tracking-[-1px]"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (query.trim()) saveToHistory(query.trim());
                onClose();
              }
            }}
            placeholder="Buscar figura, era o acontecimiento..."
            aria-label="Buscar en la matriz"
          />
          {query.trim() && (
            <button type="button" className="shrink-0 cursor-pointer border border-(--text-ink) bg-(--surface-pure) px-3 py-2 font-mono text-[10px] uppercase tracking-[.05em] shadow-[2px_2px_0_var(--text-ink)]" onClick={() => { saveToHistory(query.trim()); onClose(); }}>
              Buscar
            </button>
          )}
        </div>

        {history.length > 0 && (
          <div className="mt-4 mb-2 flex flex-wrap gap-2" role="group" aria-label="Búsquedas recientes">
            {history.slice(0, 5).map((h, i) => (
              <button
                key={i}
                type="button"
                className="cursor-pointer border border-(--border-subtle) bg-(--surface-pure) px-2 py-1 font-mono text-[10px] text-(--text-muted) hover:bg-(--background-primary)"
                onClick={() => { onQueryChange(h); saveToHistory(h); }}
              >
                {h}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 py-6" role="group" aria-label="Filtros de categoría">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={category === item.value}
              className={`cursor-pointer border px-3 py-2 text-[11px] uppercase tracking-[.06em] shadow-[2px_2px_0_var(--text-ink)] ${category === item.value ? "border-(--text-ink) bg-(--text-ink) text-white" : "border-(--text-ink) bg-(--surface-pure)"}`}
              onClick={() => setCategory(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <details className="mb-4 group" open={showAdvanced}>
          <summary className="cursor-pointer flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.06em] text-(--text-muted) hover:text-(--text-ink)">
            Filtros avanzados
            <span className="transition-transform group-open:rotate-180">▼</span>
          </summary>
          <div className="mt-4 flex flex-wrap gap-6" role="group" aria-label="Filtros avanzados">
            <fieldset className="flex flex-col gap-2">
              <legend className="font-mono text-[10px] uppercase text-(--text-muted)">Certeza</legend>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="search-certainty" value="all" checked={certainty === "all"} onChange={() => setCertainty("all")} className="sr-only" />
                  <span className={`px-2 py-1 text-[11px] border ${certainty === "all" ? "border-(--text-ink) bg-(--text-ink) text-white" : "border-(--border-subtle) bg-(--surface-pure)"}`}>Todas</span>
                </label>
                {certaintyOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="search-certainty" value={opt.value} checked={certainty === opt.value} onChange={() => setCertainty(opt.value)} className="sr-only" />
                    <span className={`px-2 py-1 text-[11px] border ${certainty === opt.value ? "border-(--text-ink) bg-(--text-ink) text-white" : "border-(--border-subtle) bg-(--surface-pure)"}`}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="flex flex-col gap-2">
              <legend className="font-mono text-[10px] uppercase text-(--text-muted)">Evidencia</legend>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="search-evidence" value="all" checked={evidence === "all"} onChange={() => setEvidence("all")} className="sr-only" />
                  <span className={`px-2 py-1 text-[11px] border ${evidence === "all" ? "border-(--text-ink) bg-(--text-ink) text-white" : "border-(--border-subtle) bg-(--surface-pure)"}`}>Todas</span>
                </label>
                {evidenceOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="search-evidence" value={opt.value} checked={evidence === opt.value} onChange={() => setEvidence(opt.value)} className="sr-only" />
                    <span className={`px-2 py-1 text-[11px] border ${evidence === opt.value ? "border-(--text-ink) bg-(--text-ink) text-white" : "border-(--border-subtle) bg-(--surface-pure)"}`}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="flex flex-col gap-2">
              <legend className="font-mono text-[10px] uppercase text-(--text-muted)">Cronología</legend>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="search-chronology" value="all" checked={chronology === "all"} onChange={() => setChronology("all")} className="sr-only" />
                  <span className={`px-2 py-1 text-[11px] border ${chronology === "all" ? "border-(--text-ink) bg-(--text-ink) text-white" : "border-(--border-subtle) bg-(--surface-pure)"}`}>Todas</span>
                </label>
                {chronologyOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="search-chronology" value={opt.value} checked={chronology === opt.value} onChange={() => setChronology(opt.value)} className="sr-only" />
                    <span className={`px-2 py-1 text-[11px] border ${chronology === opt.value ? "border-(--text-ink) bg-(--text-ink) text-white" : "border-(--border-subtle) bg-(--surface-pure)"}`}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex flex-col gap-2 min-w-[200px]">
              <label className="font-mono text-[10px] uppercase text-(--text-muted)" htmlFor="search-source">
                Buscar en fuentes
              </label>
              <input
                id="search-source"
                className="border border-(--text-ink) bg-transparent p-1 font-mono text-xs"
                type="text"
                value={sourceQuery}
                onChange={(e) => setSourceQuery(e.target.value)}
                placeholder="autor, título, editorial..."
              />
            </div>
            <div className="flex flex-col gap-2 min-w-[140px]">
              <label className="font-mono text-[10px] uppercase text-(--text-muted)" htmlFor="search-from-year">
                Desde
              </label>
              <input
                id="search-from-year"
                className="w-24 border border-(--text-ink) bg-transparent p-1 font-mono text-xs"
                type="number"
                min={TIMELINE_MIN_YEAR}
                max={TIMELINE_MAX_YEAR}
                value={fromYear}
                onChange={(event) => setFromYear(event.target.value)}
                aria-invalid={!rangeIsValid}
              />
            </div>
            <div className="flex flex-col gap-2 min-w-[140px]">
              <label className="font-mono text-[10px] uppercase text-(--text-muted)" htmlFor="search-to-year">
                Hasta
              </label>
              <input
                id="search-to-year"
                className="w-24 border border-(--text-ink) bg-transparent p-1 font-mono text-xs"
                type="number"
                min={TIMELINE_MIN_YEAR}
                max={TIMELINE_MAX_YEAR}
                value={toYear}
                onChange={(event) => setToYear(event.target.value)}
                aria-invalid={!rangeIsValid}
              />
            </div>
          </div>
        </details>

        {activeFilters.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2 border-y border-(--border-subtle) py-3" role="group" aria-label="Filtros activos">
            <span className="font-mono text-[10px] uppercase text-(--text-muted)">Activos:</span>
            {activeFilters.map((f, i) => (
              <span key={i} className="flex items-center gap-1 border border-(--text-ink) bg-(--surface-pure) px-2 py-1 text-[10px]">
                {f.label}
                <button type="button" className="ml-1 cursor-pointer text-(--text-ink) hover:text-(--category-conflict)" onClick={f.clear} aria-label={`Quitar ${f.label}`}>
                  ×
                </button>
              </span>
            ))}
            <button type="button" className="ml-2 cursor-pointer border border-(--text-ink) bg-(--surface-pure) px-2 py-1 font-mono text-[10px] uppercase tracking-[.05em] shadow-[2px_2px_0_var(--text-ink)]" onClick={clearAllFilters}>
              Limpiar todo
            </button>
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-end gap-x-5 gap-y-3 border-y border-(--border-subtle) py-3" aria-live="polite">
          <span className="font-mono text-[10px] text-(--text-muted)">
            {rangeIsValid
              ? `${formatYear(filterFrom)} — ${formatYear(filterTo)}`
              : "El año inicial debe ser menor o igual que el final"}
          </span>
          <span className="ml-auto font-mono text-[10px] uppercase text-(--text-muted)">
            {matches.length} de {events.length} acontecimientos
          </span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-3 gap-6 overflow-y-auto max-[800px]:grid-cols-1">
          <ResultColumn title="Eras" count={matchingEras.length} column="eras">
            {matchingEras.map((era) => (
              <button
                key={era.id}
                type="button"
                className="block w-full cursor-pointer border-b border-(--border-subtle) py-3 text-left"
                onClick={() => onSelectEra(era)}
                aria-label={`Ver la era ${era.name} en la línea de tiempo`}
              >
                <strong className="block text-sm">{era.name}</strong>
                <span className="font-mono text-[10px] text-(--text-muted)">{era.dateLabel}</span>
              </button>
            ))}
            {matchingEras.length === 0 && <EmptyColumn text="Ninguna era coincide con la búsqueda." />}
          </ResultColumn>
          <ResultColumn title="Figuras" count={matchingPeople.length} column="figures">
            {matchingPeople.map((person) => {
              const count = figureEventCounts.get(person) ?? 0;
              return (
                <button
                  key={person}
                  type="button"
                  className="flex w-full cursor-pointer items-baseline justify-between gap-3 border-b border-(--border-subtle) py-3 text-left"
                  onClick={() => onSelectFigure(person)}
                  aria-label={count === 1 ? `Ver el acontecimiento de ${person}` : `Ver los ${count} acontecimientos de ${person}`}
                >
                  <span className="text-sm">{person}</span>
                  <span className="shrink-0 font-mono text-[10px] text-(--text-muted)">
                    {count === 1 ? "1 evento" : `${count} eventos`}
                  </span>
                </button>
              );
            })}
            {matchingPeople.length === 0 && <EmptyColumn text="Ninguna figura coincide con la búsqueda." />}
          </ResultColumn>
          <ResultColumn title="Acontecimientos" count={matches.length} column="events">
            {matches.map((event) => (
              <button
                key={event.id}
                type="button"
                className="block w-full cursor-pointer border-b border-(--border-subtle) py-3 text-left"
                onClick={() => { onSelectEvent(event); onClose(); }}
              >
                <strong className="block text-sm">
                  {highlightMatch(event.title, query)}
                </strong>
                <span className="font-mono text-[10px] text-(--text-muted)">
                  {highlightMatch(event.dateLabel, query)} · {categoryLabel.get(event.category) ?? event.category}
                </span>
              </button>
            ))}
            {matches.length === 0 && <EmptyColumn text="Ningún acontecimiento coincide con la búsqueda." />}
          </ResultColumn>
        </div>
      </div>
    </div>
  );
}

function ResultColumn({
  title,
  count,
  children,
  column,
}: ResultColumnProps & { column: "eras" | "figures" | "events" }) {
  return (
    <section data-column={column}>
      <header className="flex items-center justify-between border-b-2 border-(--text-ink) pb-2">
        <h2 className="m-0 text-[12px] uppercase tracking-[.08em]">{title}</h2>
        <span className="font-mono text-[10px] text-(--text-muted)">{String(count).padStart(2, "0")}</span>
      </header>
      {children}
    </section>
  );
}

function EmptyColumn({ text }: { text: string }) {
  return <p className="py-4 text-[11px] leading-normal text-(--text-muted)">{text}</p>;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return text;
  const parts = text.split(new RegExp(`(${normalized})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLocaleLowerCase() === normalized
          ? <mark key={i} className="bg-(--category-sovereign) text-(--text-ink) px-0.5 rounded">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}