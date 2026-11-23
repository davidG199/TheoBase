"use client";

import type { NavbarProps } from "@/app/types/components";
import type { TimelineFilter } from "@/app/types/events";

const filters: { value: TimelineFilter; label: string; color: string }[] = [
  { value: "all", label: "Todos", color: "bg-(--text-ink)" },
  { value: "biblical", label: "Bíblico", color: "bg-(--category-prophetic)" },
  { value: "world", label: "Mundial", color: "bg-(--category-world)" },
  { value: "conflict", label: "Conflicto", color: "bg-(--category-conflict)" },
  { value: "prophecy", label: "Profecía", color: "bg-(--category-prophetic)" },
  { value: "royalty", label: "Realeza", color: "bg-(--category-sovereign)" },
];

export default function Navbar({ query, onQueryChange, onSearchOpen, lane, onLaneChange }: NavbarProps) {
  return (
    <nav className="flex h-16 min-w-0 items-center gap-3 border-b border-(--text-ink) bg-(--background-primary) px-4">
      <div className="flex shrink-0 items-center gap-4.5">
        <span className="text-[20px] font-bold tracking-[-1.2px]">
          THEOBASE
        </span>
        <span className="h-7 w-px bg-(--border-subtle) max-[420px]:hidden" />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <div className="ml-2 flex h-11 shrink items-center border border-(--border-subtle) bg-white sm:h-9 sm:w-56.75">
          <input
            className="hidden min-w-0 flex-1 border-0 bg-transparent pl-3 font-mono text-[11px] uppercase tracking-[.03em] outline-none placeholder:text-[#777777] sm:block"
            value={query}
            onFocus={onSearchOpen}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar evento o figura..."
            aria-label="Buscar evento o figura"
          />
          <button
            type="button"
            className="grid size-11 shrink-0 cursor-pointer place-items-center border-(--border-subtle) text-[#777777] sm:size-8 sm:border-l"
            onClick={onSearchOpen}
            aria-label="Abrir búsqueda"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </button>
        </div>
        <div className="ml-auto hidden items-center gap-2 pr-2 lg:flex" role="group" aria-label="Filtros de eventos">
          {filters.map((filter) => {
            const active = lane === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={active}
                className={`flex h-7 cursor-pointer items-center gap-2 border px-3 font-(--font-primary) text-[10px] font-bold uppercase tracking-[.04em] ${active ? "border-(--text-ink) bg-(--text-ink) text-white!" : "border-(--border-subtle) bg-white text-(--text-ink)"}`}
                onClick={() => onLaneChange(filter.value)}
              >
                <span className={`size-2 rounded-full ${filter.color}`} />
                {filter.label}
              </button>
            );
          })}
        </div>
        <select
          className="ml-auto h-11 max-w-45 shrink-0 cursor-pointer border border-(--border-subtle) bg-white px-2 font-mono text-[10px] uppercase tracking-[.03em] lg:hidden"
          aria-label="Filtros de eventos"
          value={lane}
          onChange={(event) => onLaneChange(event.target.value as TimelineFilter)}
        >
          {filters.map((filter) => (
            <option value={filter.value} key={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}
