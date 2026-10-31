"use client";

import { useState } from "react";
import Link from "next/link";
import type { ContextPanelProps } from "@/app/types/components";
import { Badge } from "@/app/components/ui/Badge";
import { eventLocations } from "@/app/data/location";

export function ContextPanel({ event, eras, selectedEra, onClose, onEraChange }: ContextPanelProps) {
  const [openFact, setOpenFact] = useState<string | null>(null);
  const accent = event.lane === "world" ? "var(--category-world)" : "var(--category-prophetic)";
  const location = eventLocations.find((candidate) => candidate.eventId === event.id);

  return <aside className="absolute bottom-0 right-0 top-0 z-[5] flex w-[min(480px,92%)] flex-col border-l-2 border-[var(--text-ink)] bg-[var(--surface-pure)] shadow-[-4px_0_0_var(--text-ink)]" aria-label={`Detalle de ${event.title}`}>
    <header className="sticky top-0 z-[1] flex items-start justify-between border-b border-[var(--text-ink)] bg-[var(--surface-pure)] p-6">
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[.1em] text-[var(--text-muted)]">{event.lane === "biblical" ? "Acontecimiento bíblico" : "Contexto mundial"}</p>
        <h2 className="m-0 text-[27px] font-bold leading-[1.05] tracking-[-1px]">{event.title}</h2>
        <span className="mt-3 inline-block bg-[var(--dark-bar)] px-2 py-1 font-mono text-[11px] text-white">{event.dateLabel}</span>
      </div>
      <button className="grid size-7 shrink-0 cursor-pointer place-items-center border border-[var(--text-ink)] bg-[var(--surface-pure)] text-lg leading-none" aria-label="Cerrar detalle" onClick={onClose}>×</button>
    </header>
    <div className="min-h-0 flex-1 overflow-y-auto p-6">
      <p className="text-[13px] leading-[1.6] text-[var(--text-muted)]">{event.description}</p>
      {event.scripture && <section className="my-6 border-l-4 border-[var(--category-prophetic)] bg-[var(--background-primary)] px-4 py-3.5">
        <span className="font-mono text-[9px] uppercase tracking-[.08em] text-[var(--text-muted)]">Referencia bíblica</span>
        <p className="mt-2 font-[var(--font-scripture)] text-lg leading-[1.5]">Consulta el pasaje completo en tu edición bíblica: {event.scripture}.</p>
        <a className="mt-3 inline-block border border-[var(--text-ink)] bg-[var(--surface-pure)] px-2 py-1 font-mono text-[10px] uppercase tracking-[.05em] shadow-[2px_2px_0_var(--text-ink)]" href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(event.scripture)}&version=RVR1960`} target="_blank" rel="noreferrer">Abrir cita externa</a>
      </section>}
      <section className="mb-6 border border-[var(--text-ink)] p-3" aria-label="Mapa del acontecimiento">
        <div className="mb-2 flex items-center justify-between"><h3 className="m-0 text-[11px] uppercase tracking-[.08em]">Mapa contextual</h3><span className="font-mono text-[10px] text-[var(--text-muted)]">{location?.region ?? "REGIÓN HISTÓRICA"}</span></div>
        <svg className="h-28 w-full bg-[var(--background-primary)]" viewBox="0 0 360 112" role="img" aria-label="Mapa esquemático de ubicación histórica">
          <path d="M25 83 65 34l48 16 37-27 53 24 48-5 72 43-52 15-61-18-47 15-51-20Z" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx={location?.x ?? 181} cy={location?.y ?? 58} r="5" fill={accent} stroke="var(--text-ink)" strokeWidth="2" />
        </svg>
      </section>
      <section className="border-t border-[var(--text-ink)]">
        {["Evidencia arqueológica", "Significado teológico", "Figuras relacionadas"].map((label, index) => <div className="border-b border-[var(--border-subtle)]" key={label}>
          <button className="flex w-full cursor-pointer items-center justify-between bg-transparent py-3 text-left text-[11px] font-bold uppercase tracking-[.06em]" aria-expanded={openFact === label} onClick={() => setOpenFact(openFact === label ? null : label)}>{label}<span>{openFact === label ? "−" : "+"}</span></button>
          {openFact === label && <p className="pb-3 text-[13px] leading-[1.5] text-[var(--text-muted)]">{index === 0 ? event.facts[0] : index === 1 ? event.description : event.facts.slice(1).join(" · ")}</p>}
        </div>)}
      </section>
      <section className="mt-6 border-t border-[var(--text-ink)] pt-4">
        <h3 className="mb-2.5 text-[11px] uppercase tracking-[.08em]">Explorar era</h3>
        <label className="mb-2 block font-mono text-[10px] uppercase text-[var(--text-muted)]" htmlFor="era-select">Contexto temporal</label>
        <select className="w-full border border-[var(--text-ink)] bg-[var(--surface-pure)] p-2 text-xs" id="era-select" value={selectedEra.id} onChange={(change) => onEraChange(change.target.value)}>{eras.map((era) => <option value={era.id} key={era.id}>{era.name} · {era.dateLabel}</option>)}</select>
        <div className="mt-3 flex items-baseline justify-between gap-2"><strong className="font-mono text-[13px]">{selectedEra.duration}</strong><span className="text-right text-[11px] text-[var(--text-muted)]">{selectedEra.leaders.join(" · ")}</span></div>
        <Link className="mt-4 inline-block bg-[var(--dark-bar)] px-3 py-2 text-[11px] font-bold uppercase tracking-[.06em] text-white shadow-[4px_4px_0_var(--category-prophetic)]" href={`/era/${selectedEra.id}`}>Ver detalle de era</Link>
      </section>
      <Badge tone={event.lane === "world" ? "violet" : "teal"}>{event.lane === "world" ? "Contexto mundial" : "Narrativa bíblica"}</Badge>
    </div>
  </aside>;
}
