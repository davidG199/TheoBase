"use client";

import type { NavbarProps } from "@/app/types/components";

const filters = [
  { value: "conflict", label: "Conflict", color: "bg-[var(--category-conflict)]" },
  { value: "prophecy", label: "Prophecy", color: "bg-[var(--category-prophetic)]" },
  { value: "royalty", label: "Royalty", color: "bg-[var(--category-sovereign)]" },
] as const;

export default function Navbar({ query, onQueryChange, onSearchOpen, lane, onLaneChange }: NavbarProps) {
  return (
    <nav className="flex h-16 min-w-0 items-center justify-between border-b border-(--text-ink) bg-(--background-primary) px-4">
      <div className="flex items-center gap-4.5">
        <span className="text-[20px] font-bold tracking-[-1.2px]">
          THEOBASE
        </span>
        <span className="h-7 w-px bg-(--border-subtle)" />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <label className="ml-7 flex h-9 w-56.75 shrink items-center gap-2 border border-(--border-subtle) bg-white px-3 max-[800px]:ml-2 max-[800px]:w-47.5">
          <svg className="shrink-0 text-[#777777]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input 
            className="min-w-0 w-full border-0 bg-transparent font-mono text-[11px] uppercase tracking-[.03em] outline-none placeholder:text-[#777777]" 
            value={query} 
            onFocus={onSearchOpen} 
            onChange={(event) => onQueryChange(event.target.value)} 
            placeholder="Query timeline..." 
            aria-label="Buscar evento" 
          />
          <kbd className="shrink-0 border-l border-(--border-subtle) pl-2 font-mono text-[8px] text-[#999999]">
            CMD+K
          </kbd>
        </label>
        <div className="ml-auto hidden items-center gap-2 pr-2 md:flex" role="group" aria-label="Filtros de eventos">
          {filters.map((filter) => {
            const active = lane === filter.value;
            return (
              <button 
                type="button" 
                aria-pressed={active} 
                className={`flex h-7 cursor-pointer items-center gap-2 border px-3 font-(--font-primary) text-[10px] font-bold uppercase tracking-[.04em] ${active ? "border-(--text-ink) bg-(--text-ink) text-white!" : "border-(--border-subtle) bg-white text-(--text-ink)"}`} 
                key={filter.label} 
                onClick={() => onLaneChange(active ? "all" : filter.value)}
                >
                  <span className={`size-2 rounded-full ${filter.color}`} />
                  {filter.label}
              </button>);
          })}
        </div>
        <button className="ml-1 grid size-9 cursor-pointer place-items-center border border-(--border-subtle) bg-white" aria-label="Abrir ajustes">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="m19.4 15 .1.1a2 2 0 1 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4v.3a2 2 0 1 1-4 0v-.2A2 2 0 0 0 5.8 18l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A2 2 0 0 0 1.6 12.8v-.3a2 2 0 1 1 4 0A2 2 0 0 0 9 11v-.3a2 2 0 1 1 4 0v.2a2 2 0 0 0 3.4 1.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A2 2 0 0 0 19.4 15Z" /></svg>
        </button>
        <button 
          className="grid size-9 cursor-pointer place-items-center bg-[#111111] font-(--font-primary) text-[11px] font-bold text-white" 
          aria-label="Perfil de usuario"
          >
          JD
        </button>
      </div>
    </nav>
  );
}
