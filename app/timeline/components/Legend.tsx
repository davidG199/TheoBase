"use client";

import type { LegendProps } from "@/app/types/components";

const categoryItems = [
  { key: "prophetic", label: "Profecía", color: "var(--category-prophetic)" },
  { key: "conflict", label: "Conflicto", color: "var(--category-conflict)" },
  { key: "sovereign", label: "Realeza / Soberanía", color: "var(--category-sovereign)" },
  { key: "world", label: "Contexto mundial", color: "var(--category-world)" },
  { key: "council", label: "Concilio", color: "var(--category-council)" },
  { key: "reform", label: "Reforma", color: "var(--category-reform)" },
  { key: "mission", label: "Misión", color: "var(--category-mission)" },
];

const laneItems = [
  { key: "biblical", label: "Narrativa bíblica", color: "var(--category-prophetic)" },
  { key: "world", label: "Contexto mundial", color: "var(--category-world)" },
  { key: "church", label: "Historia del cristianismo", color: "var(--category-council)" },
];

const importanceItems = [
  { key: "major", label: "Evento mayor", size: 12 },
  { key: "minor", label: "Evento menor", size: 6 },
];

export function Legend({ className }: LegendProps) {
  return (
    <aside className={`fixed bottom-16 right-4 z-4 w-56 bg-(--surface-pure) border border-(--text-ink) p-3 shadow-[4px_4px_0_var(--text-ink)] ${className ?? ""}`} aria-label="Leyenda">
      <h3 className="mb-3 font-mono text-[9px] uppercase tracking-[.08em] text-(--text-ink)">
        Leyenda
      </h3>
      
      <section className="mb-3" aria-label="Carriles">
        <h4 className="mb-1 font-mono text-[9px] uppercase tracking-[.06em] text-(--text-muted)">
          Carriles
        </h4>
        <ul className="flex flex-wrap gap-2">
          {laneItems.map((item) => (
            <li key={item.key} className="flex items-center gap-1.5">
              <span 
                className="w-2.5 h-2.5 rounded-full border border-(--text-ink)" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px]">{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-3" aria-label="Categorías">
        <h4 className="mb-1 font-mono text-[9px] uppercase tracking-[.06em] text-(--text-muted)">
          Categorías
        </h4>
        <ul className="flex flex-wrap gap-2">
          {categoryItems.map((item) => (
            <li key={item.key} className="flex items-center gap-1.5">
              <span 
                className="w-2.5 h-2.5 rounded-full border border-(--text-ink)" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px]">{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-3" aria-label="Importancia">
        <h4 className="mb-1 font-mono text-[9px] uppercase tracking-[.06em] text-(--text-muted)">
          Importancia
        </h4>
        <ul className="flex flex-wrap gap-2">
          {importanceItems.map((item) => (
            <li key={item.key} className="flex items-center gap-1.5">
              <span 
                className="rounded-full border border-(--text-ink) bg-(--text-ink)" 
                style={{ width: item.size, height: item.size }}
              />
              <span className="text-[10px]">{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Otros símbolos">
        <h4 className="mb-1 font-mono text-[9px] uppercase tracking-[.06em] text-(--text-muted)">
          Otros
        </h4>
        <ul className="space-y-1 text-[10px]">
          <li className="flex items-center gap-1.5">
            <span className="w-5 h-0.5 bg-(--text-ink) rounded" />
            <span>Marcas de año (según nivel de zoom)</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-5 h-0.5 bg-(--category-prophetic) opacity-70" />
            <span>Línea de año actual</span>
          </li>
          <li className="flex items-center gap-1.5">
            <svg className="w-5 h-5 text-(--text-muted)" viewBox="0 0 12 12" fill="none">
              <path d="M10 2L2 10M2 2L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Selección / cierre panel</span>
          </li>
        </ul>
      </section>
    </aside>
  );
}