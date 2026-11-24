"use client";

import { useState } from "react";
import Link from "next/link";
import { eras } from "@/app/data/eras";
import { Card } from "@/app/components/ui/Card";
import type { TimelineEra, EraHighlight } from "@/app/types/era";

const formatYear = (year: number): string => year < 0 ? `${Math.abs(year)} a.C.` : `${year} d.C.`;

interface EraDetailContentProps {
  era: TimelineEra;
  prevEra: TimelineEra | null;
  nextEra: TimelineEra | null;
  currentIndex: number;
  allHighlights: (EraHighlight & { source: "era" | "event" })[];
}

export function EraDetailContent({ 
  era, 
  prevEra, 
  nextEra, 
  currentIndex,
  allHighlights,
}: EraDetailContentProps) {
  const [viewMode, setViewMode] = useState<"biblical" | "world" | "both">("both");
  const [openSubPeriod, setOpenSubPeriod] = useState<string | null>(null);

  const filteredHighlights = allHighlights.filter((h) => {
    if (viewMode === "biblical") return h.lane === "biblical";
    if (viewMode === "world") return h.lane === "world";
    return true;
  });

  return (
    <main className="min-h-screen bg-(--background-primary) p-8 max-[800px]:p-4">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-start justify-between gap-4 border-b-2 border-(--text-ink) pb-5">
          <div>
            <Link
              className="font-mono text-[10px] uppercase tracking-[.08em] text-(--text-muted)"
              href={`/timeline?era=${era.id}`}
            >
              ← Volver a la línea temporal
            </Link>
            <p className="mb-2 mt-6 font-mono text-[10px] uppercase tracking-widest text-(--category-prophetic)">
              Detalle de era
            </p>
            <h1 className="m-0 text-[clamp(36px,7vw,72px)] font-bold leading-none tracking-[-3px]">
              {era.name}
            </h1>
            <p className="mt-3 font-mono text-xs text-(--text-muted)">
              {era.dateLabel}
            </p>
          </div>
          <span className="hidden border border-(--text-ink) bg-(--surface-pure) px-3 py-2 font-mono text-[10px] uppercase md:block">
            Nexus / Archivo histórico
          </span>
        </header>

        {/* Navegación entre eras */}
        <nav className="mb-8 flex items-center justify-between gap-4" aria-label="Navegación entre eras">
          {prevEra && (
            <Link
              className="flex items-center gap-2 border border-(--text-ink) bg-(--surface-pure) px-3 py-2 text-sm font-bold uppercase tracking-[.05em] shadow-[2px_2px_0_var(--text-ink)]"
              href={`/era/${prevEra.id}`}
              aria-label={`Era anterior: ${prevEra.name}`}
            >
              ← {prevEra.name}
            </Link>
          )}
          <div className="flex-1 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[.08em] text-(--text-muted)">
              Era {currentIndex + 1} de {eras.length}
            </span>
          </div>
          {nextEra && (
            <Link
              className="flex items-center gap-2 border border-(--text-ink) bg-(--surface-pure) px-3 py-2 text-sm font-bold uppercase tracking-[.05em] shadow-[2px_2px_0_var(--text-ink)]"
              href={`/era/${nextEra.id}`}
              aria-label={`Era siguiente: ${nextEra.name}`}
            >
              {nextEra.name} →
            </Link>
          )}
        </nav>

        {/* Toggle vista */}
        <div className="mb-6 flex items-center gap-4" role="group" aria-label="Filtrar hitos por carril">
          <span className="font-mono text-[10px] uppercase tracking-[.08em] text-(--text-muted)">
            Vista:
          </span>
          <div className="flex items-center gap-2 border border-(--border-subtle) bg-(--surface-pure) p-1">
            {(["both", "biblical", "world"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-[.05em] rounded ${viewMode === mode ? "bg-(--text-ink) text-white" : "bg-transparent text-(--text-muted) hover:bg-(--background-primary)"}`}
                onClick={() => setViewMode(mode)}
                aria-pressed={viewMode === mode}
              >
                {mode === "both" ? "Ambos" : mode === "biblical" ? "Bíblico" : "Mundial"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
          <Card className="col-span-2 p-6">
            <span className="font-mono text-[10px] uppercase tracking-[.08em] text-(--text-muted)">
              Duración
            </span>
            <strong className="mt-4 block text-5xl font-bold tracking-[-2px]">
              {era.duration}
            </strong>
            <p className="mt-3 text-sm text-(--text-muted)">
              Periodo representado en la cronología bíblica.
            </p>
          </Card>
          <Card className="p-6">
            <span className="font-mono text-[10px] uppercase tracking-[.08em] text-(--text-muted)">
              Hitos
            </span>
            <strong className="mt-4 block text-5xl font-bold tracking-[-2px]">
              {String(filteredHighlights.length).padStart(2, "0")}
            </strong>
            <p className="mt-3 text-sm text-(--text-muted)">
              {viewMode === "both" 
                ? `${filteredHighlights.filter(h => h.lane === "biblical").length} bíblicos · ${filteredHighlights.filter(h => h.lane === "world").length} mundiales`
                : viewMode === "biblical"
                  ? `${filteredHighlights.length} bíblicos`
                  : `${filteredHighlights.length} mundiales`}
            </p>
          </Card>
          <Card className="p-6">
            <span className="font-mono text-[10px] uppercase tracking-[.08em] text-(--text-muted)">
              Líderes
            </span>
            <strong className="mt-4 block text-5xl font-bold tracking-[-2px]">
              {String(era.leaders.length).padStart(2, "0")}
            </strong>
            <p className="mt-3 text-sm text-(--text-muted)">
              Figuras activas en la era.
            </p>
          </Card>

          {/* Subperíodos */}
          {era.subPeriods && era.subPeriods.length > 0 && (
            <Card className="col-span-4 p-6 max-[600px]:col-span-1">
              <div className="flex items-center justify-between">
                <h2 className="m-0 text-sm uppercase tracking-[.08em]">
                  Subperíodos
                </h2>
                <span className="font-mono text-[10px] text-(--text-muted)">
                  FASES INTERNAS
                </span>
              </div>
              <ul className="mt-5 space-y-4" role="list" aria-label="Subperíodos de la era">
                {era.subPeriods.map((sub) => (
                  <li key={sub.id} className="border border-(--text-ink) p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <strong className="text-lg">{sub.name}</strong>
                          <span className="font-mono text-[10px] uppercase text-(--text-muted)">
                            {formatYear(sub.startYear)} – {formatYear(sub.endYear)}
                          </span>
                        </div>
                        {sub.description && (
                          <p className="mt-1 text-sm text-(--text-muted)">
                            {sub.description}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        className="shrink-0 cursor-pointer border border-(--text-ink) bg-(--surface-pure) px-2 py-1 font-mono text-[10px] uppercase tracking-[.05em] shadow-[2px_2px_0_var(--text-ink)]"
                        onClick={() => setOpenSubPeriod(openSubPeriod === sub.id ? null : sub.id)}
                        aria-expanded={openSubPeriod === sub.id}
                      >
                        {openSubPeriod === sub.id ? "Ocultar" : "Detalles"}
                      </button>
                    </div>
                    {openSubPeriod === sub.id && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-mono text-[9px] uppercase tracking-[.08em] text-(--text-muted)">
                            Gobernantes
                          </h4>
                          <ul className="mt-2 space-y-1 text-sm">
                            {sub.rulers.map((r, i) => (
                              <li key={i} className="border-l-2 border-(--category-sovereign) pl-2">
                                {r}
                              </li>
                            ))}
                            {sub.rulers.length === 0 && (
                              <li className="text-(--text-muted) text-sm">—</li>
                            )}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-mono text-[9px] uppercase tracking-[.08em] text-(--text-muted)">
                            Profetas
                          </h4>
                          <ul className="mt-2 space-y-1 text-sm">
                            {sub.prophets.map((p, i) => (
                              <li key={i} className="border-l-2 border-(--category-prophetic) pl-2">
                                {p}
                              </li>
                            ))}
                            {sub.prophets.length === 0 && (
                              <li className="text-(--text-muted) text-sm">—</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Lista de hitos */}
          <Card className="col-span-4 p-6 max-[600px]:col-span-1">
            <div className="flex items-center justify-between">
              <h2 className="m-0 text-sm uppercase tracking-[.08em]">
                Hitos de la era
              </h2>
              <span className="font-mono text-[10px] text-(--text-muted)">
                {filteredHighlights.length} EVENTOS
              </span>
            </div>
            {filteredHighlights.length > 0 ? (
              <ul className="mt-5 space-y-3 max-h-96 overflow-y-auto" role="list" aria-label="Hitos de la era">
                {filteredHighlights.map((highlight) => (
                  <li key={highlight.id} className="border border-(--text-ink) p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <strong className="text-sm truncate">{highlight.title}</strong>
                          <span className="shrink-0 font-mono text-[10px] text-(--text-muted)">
                            {highlight.dateLabel}
                          </span>
                          <span className={`shrink-0 px-1.5 py-0.5 text-[9px] uppercase rounded ${getCategoryColor(highlight.category)}`}>
                            {getCategoryLabel(highlight.category)}
                          </span>
                          <span className={`shrink-0 px-1.5 py-0.5 text-[9px] uppercase rounded ${highlight.lane === "biblical" ? "bg-(--category-prophetic) text-white" : highlight.lane === "world" ? "bg-(--category-world) text-white" : "bg-(--category-council) text-white"}`}>
                            {highlight.lane === "biblical" ? "Bíblico" : highlight.lane === "world" ? "Mundial" : "Iglesia"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-(--text-muted) line-clamp-2">
                          {highlight.description}
                        </p>
                      </div>
                      <Link
                        className="shrink-0 cursor-pointer border border-(--text-ink) bg-(--surface-pure) px-2 py-1 font-mono text-[10px] uppercase tracking-[.05em] shadow-[2px_2px_0_var(--text-ink)]"
                        href={`/timeline?event=${highlight.id}`}
                        aria-label={`Ver ${highlight.title} en la línea de tiempo`}
                      >
                        Ver en timeline
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-sm text-(--text-muted)">
                No hay hitos que coincidan con el filtro seleccionado.
              </p>
            )}
          </Card>

          {/* Contexto mundial */}
          <Card className="col-span-4 p-6 max-[900px]:col-span-2 max-[600px]:col-span-1">
            <div className="flex items-center justify-between">
              <h2 className="m-0 text-sm uppercase tracking-[.08em]">
                Contexto mundial
              </h2>
              <span className="font-mono text-[10px] text-(--text-muted)">
                {era.worldContext ? "RESUMEN + EVENTOS" : "SIN DATOS"}
              </span>
            </div>
            {era.worldContext ? (
              <>
                <p className="mt-4 text-sm text-(--text-muted)">
                  {era.worldContext.summary}
                </p>
                {era.worldContext.parallelEvents.length > 0 && (
                  <ul className="mt-5 grid grid-cols-2 gap-3 text-sm max-[600px]:grid-cols-1" role="list" aria-label="Eventos mundiales paralelos">
                    {era.worldContext.parallelEvents.map((event) => (
                      <li key={event.id} className="border-l-2 border-(--category-world) pl-3">
                        <span className="block font-mono text-[10px] text-(--text-muted)">
                          {event.dateLabel}
                        </span>
                        <strong className="block text-sm">{event.title}</strong>
                        <p className="mt-0.5 text-xs text-(--text-muted) line-clamp-1">
                          {event.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="mt-5 text-sm text-(--text-muted)">
                Sin datos de contexto mundial para esta era.
              </p>
            )}
          </Card>

          {/* Potencias mundiales */}
          <Card className="col-span-4 p-6 max-[900px]:col-span-2 max-[600px]:col-span-1">
            <div className="flex items-center justify-between">
              <h2 className="m-0 text-sm uppercase tracking-[.08em]">
                Potencias mundiales
              </h2>
              <span className="font-mono text-[10px] text-(--text-muted)">
                CONTEXTO GLOBAL
              </span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4 max-[600px]:grid-cols-1">
              {era.powers.map((power) => (
                <div key={power.name} className="border border-(--text-ink) p-4">
                  <strong className="block text-lg">{power.name}</strong>
                  <span className={`mt-2 inline-block px-2 py-1 font-mono text-[10px] uppercase ${power.status === "pico" ? "bg-(--category-sovereign)" : power.status === "ascenso" ? "bg-(--category-prophetic) text-white" : "bg-(--category-conflict) text-white"}`}>
                    {power.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Comparación con eras adyacentes */}
          {(prevEra || nextEra) && (
            <Card className="col-span-4 p-6 max-[900px]:col-span-2 max-[600px]:col-span-1">
              <h2 className="m-0 text-sm uppercase tracking-[.08em] mb-4">
                Comparación con eras adyacentes
              </h2>
              <div className="grid grid-cols-3 gap-4 max-[600px]:grid-cols-1">
                {prevEra && (
                  <div className="border border-(--border-subtle) p-4">
                    <h3 className="font-mono text-[10px] uppercase tracking-[.05em] text-(--text-muted) mb-2">
                      Anterior
                    </h3>
                    <Link href={`/era/${prevEra.id}`} className="block">
                      <strong className="text-lg">{prevEra.name}</strong>
                      <span className="block font-mono text-[10px] text-(--text-muted) mt-1">{prevEra.dateLabel}</span>
                    </Link>
                    <div className="mt-3 text-sm text-(--text-muted)">
                      Duración: {prevEra.duration}<br />
                      Hitos: {prevEra.highlights?.length ?? 0}<br />
                      Líderes: {prevEra.leaders.length}
                    </div>
                  </div>
                )}
                <div className="border-2 border-(--category-prophetic) p-4 bg-[rgba(0,128,128,.05)]">
                  <h3 className="font-mono text-[10px] uppercase tracking-[.05em] text-(--category-prophetic) mb-2">
                    Actual
                  </h3>
                  <strong className="text-lg">{era.name}</strong>
                  <span className="block font-mono text-[10px] text-(--text-muted) mt-1">{era.dateLabel}</span>
                  <div className="mt-3 text-sm text-(--text-muted)">
                    Duración: {era.duration}<br />
                    Hitos: {era.highlights?.length ?? 0}<br />
                    Líderes: {era.leaders.length}
                  </div>
                </div>
                {nextEra && (
                  <div className="border border-(--border-subtle) p-4">
                    <h3 className="font-mono text-[10px] uppercase tracking-[.05em] text-(--text-muted) mb-2">
                      Siguiente
                    </h3>
                    <Link href={`/era/${nextEra.id}`} className="block">
                      <strong className="text-lg">{nextEra.name}</strong>
                      <span className="block font-mono text-[10px] text-(--text-muted) mt-1">{nextEra.dateLabel}</span>
                    </Link>
                    <div className="mt-3 text-sm text-(--text-muted)">
                      Duración: {nextEra.duration}<br />
                      Hitos: {nextEra.highlights?.length ?? 0}<br />
                      Líderes: {nextEra.leaders.length}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        <Link
          className="mt-8 inline-block bg-(--dark-bar) px-5 py-3 text-xs font-bold uppercase tracking-[.08em] text-white shadow-[4px_4px_0_var(--category-prophetic)]"
          href={`/timeline?era=${era.id}`}
        >
          Entrar en la línea temporal
        </Link>
      </div>
    </main>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    prophetic: "bg-(--category-prophetic) text-white",
    conflict: "bg-(--category-conflict) text-white",
    sovereign: "bg-(--category-sovereign) text-white",
    world: "bg-(--category-world) text-white",
    council: "bg-(--category-council) text-white",
    reform: "bg-(--category-reform) text-white",
    mission: "bg-(--category-mission) text-white",
  };
  return colors[category] ?? "bg-(--border-subtle) text-(--text-ink)";
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    prophetic: "PROFECÍA",
    conflict: "CONFLICTO",
    sovereign: "REALEZA",
    world: "MUNDIAL",
    council: "CONCILIO",
    reform: "REFORMA",
    mission: "MISIÓN",
  };
  return labels[category] ?? category.toUpperCase();
}