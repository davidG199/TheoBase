"use client";

import { useEffect, useMemo, useState } from "react";
import type { ResultColumnProps, SearchMatrixProps } from "@/app/types/components";
import { eventMatchesQuery } from "@/app/lib/timeline-utils";

const categories = ["Todos", "Prophetic", "Conflict", "Royalty", "World History"] as const;

export function SearchMatrix({ query, eras, events, onQueryChange, onClose, onSelectEvent }: SearchMatrixProps) {
  const [category, setCategory] = useState<(typeof categories)[number]>("Todos");
  const [fromYear, setFromYear] = useState(-4004);
  const [toYear, setToYear] = useState(70);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const matches = useMemo(() => events.filter((event) => {
    const categoryMatches = category === "Todos" || event.category === ({
      Prophetic: "prophetic",
      Conflict: "conflict",
      Royalty: "sovereign",
      "World History": "world",
    } as const)[category];
    return categoryMatches && eventMatchesQuery(event, query) && event.year >= fromYear && event.year <= toYear;
  }), [category, events, fromYear, query, toYear]);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matchingEras = eras.filter((era) => !normalizedQuery || `${era.name} ${era.dateLabel} ${era.leaders.join(" ")}`.toLocaleLowerCase().includes(normalizedQuery));
  const matchingPeople = Array.from(new Set(eras.flatMap((era) => era.leaders))).filter((person) => !normalizedQuery || person.toLocaleLowerCase().includes(normalizedQuery));

  return <div className="fixed inset-0 z-20 bg-[rgba(255,255,255,.95)] p-8 max-[800px]:p-4" role="dialog" aria-modal="true" aria-label="Matriz de búsqueda">
    <div className="mx-auto flex h-full max-w-6xl flex-col">
      <header className="flex items-center justify-between border-b-2 border-[var(--text-ink)] pb-4">
        <span className="font-mono text-[11px] uppercase tracking-[.1em]">Search Matrix</span>
        <button className="grid size-8 cursor-pointer place-items-center border border-[var(--text-ink)] bg-[var(--surface-pure)] text-xl" aria-label="Cerrar búsqueda" onClick={onClose}>×</button>
      </header>
      <input autoFocus className="mt-8 w-full border-0 border-b-2 border-[var(--text-ink)] bg-transparent px-0 py-3 font-bold text-[clamp(32px,6vw,64px)] tracking-[-2px] outline-none" value={query} onChange={(event) => onQueryChange(event.target.value)} onKeyDown={(event) => event.key === "Enter" && onClose()} placeholder="Buscar figura, era o acontecimiento..." aria-label="Buscar en la matriz" />
      <div className="flex flex-wrap gap-2 py-6" role="group" aria-label="Filtros de categoría">
        {categories.map((item) => <button key={item} className={`cursor-pointer border px-3 py-2 text-[11px] uppercase tracking-[.06em] shadow-[2px_2px_0_var(--text-ink)] ${category === item ? "border-[var(--text-ink)] bg-[var(--text-ink)] text-white" : "border-[var(--text-ink)] bg-[var(--surface-pure)]"}`} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <div className="mb-6 flex flex-wrap items-end gap-3 border-y border-[var(--border-subtle)] py-3">
        <label className="font-mono text-[10px] uppercase">Desde<input className="ml-2 w-24 border border-[var(--text-ink)] bg-transparent p-1 font-mono text-xs" type="number" value={fromYear} onChange={(event) => setFromYear(Number(event.target.value))} /></label>
        <label className="font-mono text-[10px] uppercase">Hasta<input className="ml-2 w-24 border border-[var(--text-ink)] bg-transparent p-1 font-mono text-xs" type="number" value={toYear} onChange={(event) => setToYear(Number(event.target.value))} /></label>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-6 overflow-y-auto max-[800px]:grid-cols-1">
        <ResultColumn title="Eras" count={matchingEras.length}>{matchingEras.map((era) => <button className="block w-full border-b border-[var(--border-subtle)] py-3 text-left" key={era.id} onClick={onClose}><strong className="block text-sm">{era.name}</strong><span className="font-mono text-[10px] text-[var(--text-muted)]">{era.dateLabel}</span></button>)}</ResultColumn>
        <ResultColumn title="Figuras" count={matchingPeople.length}>{matchingPeople.map((person) => <button className="block w-full border-b border-[var(--border-subtle)] py-3 text-left text-sm" key={person} onClick={onClose}>{person}</button>)}</ResultColumn>
        <ResultColumn title="Acontecimientos" count={matches.length}>{matches.map((event) => <button className="block w-full border-b border-[var(--border-subtle)] py-3 text-left" key={event.id} onClick={() => { onSelectEvent(event); onClose(); }}><strong className="block text-sm">{event.title}</strong><span className="font-mono text-[10px] text-[var(--text-muted)]">{event.dateLabel}</span></button>)}</ResultColumn>
      </div>
    </div>
  </div>;
}

function ResultColumn({ title, count, children }: ResultColumnProps) {
  return <section><header className="flex items-center justify-between border-b-2 border-[var(--text-ink)] pb-2"><h2 className="m-0 text-[12px] uppercase tracking-[.08em]">{title}</h2><span className="font-mono text-[10px] text-[var(--text-muted)]">{String(count).padStart(2, "0")}</span></header>{children}</section>;
}
