"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ContextPanelProps } from "@/app/types/components";
import type { TimelineEvent, TimelineFact } from "@/app/types/events";
import { Badge } from "@/app/components/ui/Badge";
import { eventLocations } from "@/app/data/location";

const laneLabel = (lane: ContextPanelProps["event"]["lane"]): string => {
  if (lane === "biblical") return "Acontecimiento bíblico";
  if (lane === "church") return "Historia del cristianismo";
  return "Contexto mundial";
};

const chronologyLabel = (chronology: NonNullable<ContextPanelProps["event"]["chronology"]>): string => {
  if (chronology === "biblical-traditional") return "Cronología tradicional";
  if (chronology === "historical") return "Datación histórica";
  return "Datación mixta";
};

const evidenceLabel = (evidence: NonNullable<ContextPanelProps["event"]["evidenceType"]>): string => {
  const labels = {
    "biblical-text": "Texto bíblico",
    archaeological: "Arqueología",
    inscription: "Inscripción",
    literary: "Fuente literaria",
    "historical-reconstruction": "Reconstrucción histórica",
    mixed: "Evidencia mixta",
  } as const;
  return labels[evidence];
};

const certaintyLabel = (certainty: NonNullable<ContextPanelProps["event"]["certainty"]>): string => {
  if (certainty === "established") return "establecida";
  if (certainty === "approximate") return "aproximada";
  return "discutida";
};

const certaintyClass = (certainty: NonNullable<ContextPanelProps["event"]["certainty"]>): string => {
  if (certainty === "established") return "border-(--category-prophetic) text-(--category-prophetic)";
  if (certainty === "approximate") return "border-(--category-sovereign) text-(--text-ink)";
  return "border-(--category-conflict) text-(--category-conflict)";
};

function isStructuredFact(fact: string | TimelineFact): fact is TimelineFact {
  return typeof fact === "object" && "text" in fact;
}

function getFactText(fact: string | TimelineFact): string {
  return isStructuredFact(fact) ? fact.text : fact;
}

function getFactSource(fact: string | TimelineFact): TimelineFact["source"] {
  return isStructuredFact(fact) ? fact.source : undefined;
}

function renderFact(fact: string | TimelineFact): React.ReactNode {
  const text = getFactText(fact);
  const source = getFactSource(fact);
  return (
    <>
      {text}
      {source && (
        <span className="ml-1 font-mono text-[10px] text-(--text-muted)">
          〔{source.title}〕
        </span>
      )}
    </>
  );
}

export function ContextPanel({ event, eras, selectedEra, onClose, onEraChange, onNavigateEvent, allEvents }: ContextPanelProps) {
  const [openFact, setOpenFact] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const accent = event.lane === "world"
    ? "var(--category-world)"
    : event.lane === "church"
      ? "var(--category-council)"
      : "var(--category-prophetic)";
  const location = eventLocations.find((candidate) => candidate.eventId === event.id);
  const facts = event.facts.filter(Boolean);

  // Focus management
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    const closeButton = panelRef.current?.querySelector('button[aria-label="Cerrar detalle"]') as HTMLElement;
    closeButton?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    };
  }, []);

  // Escape key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Trap focus inside panel
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener("keydown", handleTab);
    return () => panel.removeEventListener("keydown", handleTab);
  }, []);

  const copyCitation = async () => {
    const citation = `${event.title} (${event.dateLabel}) — ${event.description.slice(0, 200)}… — TheoBase`;
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyDeepLink = async () => {
    const url = `${window.location.origin}/timeline?event=${event.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedEvents = event.relatedEventIds
    ?.map((id) => allEvents?.find((e) => e.id === id))
    .filter(Boolean) as TimelineEvent[] ?? [];

  // We need access to allEvents for related events - pass it via props or get from context
  // For now, we'll use a placeholder and the parent will need to pass related events
  // Actually, let's just pass them via a new prop or we can infer from the existing data

  return (
    <aside
      ref={panelRef}
      className="absolute bottom-0 right-0 top-0 z-5 flex w-[min(480px,92%)] flex-col border-l-2 border-(--text-ink) bg-(--surface-pure) shadow-[-4px_0_0_var(--text-ink)]"
      aria-label={`Detalle de ${event.title}`}
      role="dialog"
      aria-modal="true"
    >
      <header className="sticky top-0 z-1 flex items-start justify-between border-b border-(--text-ink) bg-(--surface-pure) p-6">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-(--text-muted)">
            {laneLabel(event.lane)}
          </p>
          <h2 className="m-0 text-[27px] font-bold leading-[1.05] tracking-[-1px]">
            {event.title}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-block bg-(--dark-bar) px-2 py-1 font-mono text-[11px] text-white">
              {event.dateLabel}
            </span>
            {event.historicalDate && (
              <span className="inline-block bg-[rgba(212,175,55,.15)] px-2 py-1 font-mono text-[11px] text-(--text-ink) border border-(--category-sovereign)">
                Hist.: {event.historicalDate}
              </span>
            )}
          </div>
          {event.historicalYear !== undefined && event.year !== event.historicalYear && (
            <p className="mt-2 font-mono text-[10px] leading-normal text-(--text-muted)">
              Doble datación: tradicional {event.year < 0 ? `${Math.abs(event.year)} a.C.` : `${event.year} d.C.`} / histórica {event.historicalYear < 0 ? `${Math.abs(event.historicalYear)} a.C.` : `${event.historicalYear} d.C.`}
            </p>
          )}
        </div>
        <button className="grid size-7 shrink-0 cursor-pointer place-items-center border border-(--text-ink) bg-(--surface-pure) text-lg leading-none" aria-label="Cerrar detalle" onClick={onClose}>×</button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        <p className="text-[13px] leading-[1.6] text-(--text-muted)">
          {event.description}
        </p>

        {event.dateNote && (
          <p className="mt-3 border-l-2 border-(--border-subtle) pl-3 text-[12px] leading-[1.55] text-(--text-muted)">
            {event.dateNote}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {event.period && (
            <span className="border border-(--border-subtle) px-2 py-1 font-mono text-[9px] uppercase tracking-[.05em]">
              {event.period}
            </span>
          )}
          {event.chronology && (
            <span className="border border-(--border-subtle) px-2 py-1 font-mono text-[9px] uppercase tracking-[.05em]">
              {chronologyLabel(event.chronology)}
            </span>
          )}
          {event.evidenceType && (
            <span className="border border-(--border-subtle) px-2 py-1 font-mono text-[9px] uppercase tracking-[.05em]">
              {evidenceLabel(event.evidenceType)}
            </span>
          )}
          {event.certainty && (
            <span className={`border px-2 py-1 font-mono text-[9px] uppercase tracking-[.05em] ${certaintyClass(event.certainty)}`}>
              Certeza: {certaintyLabel(event.certainty)}
            </span>
          )}
        </div>

        {event.figures && event.figures.length > 0 && (
          <section className="mt-5" aria-label="Personajes relacionados">
            <h3 className="m-0 font-mono text-[9px] uppercase tracking-[.08em] text-(--text-muted)">
              Personajes clave
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {event.figures.map((figure) => (
                <span className="border border-(--text-ink) bg-(--background-primary) px-2 py-1 text-[11px]" key={figure}>
                  {figure}
                </span>
              ))}
            </div>
          </section>
        )}

        {event.scripture && (
          <section className="my-6 border-l-4 border-(--category-prophetic) bg-(--background-primary) px-4 py-3.5">
            <span className="font-mono text-[9px] uppercase tracking-[.08em] text-(--text-muted)">
              Referencia bíblica
            </span>
            <p className="mt-2 font-(--font-scripture) text-lg leading-normal">
              Consulta el pasaje completo en tu edición bíblica: {event.scripture}.
            </p>
            <a
              className="mt-3 inline-block border border-(--text-ink) bg-(--surface-pure) px-2 py-1 font-mono text-[10px] uppercase tracking-[.05em] shadow-[2px_2px_0_var(--text-ink)]"
              href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(event.scripture)}&version=RVR1960`}
              target="_blank"
              rel="noreferrer"
            >
              Abrir cita externa
            </a>
          </section>
        )}

        {event.sources && event.sources.length > 0 && (
          <section className="mb-6 border border-(--border-subtle) p-3" aria-label="Fuentes históricas">
            <h3 className="m-0 text-[11px] uppercase tracking-[.08em]">
              Fuentes generales
            </h3>
            <div className="mt-2 flex flex-col gap-2">
              {event.sources.map((source) => (
                <a
                  className="text-[12px] leading-[1.4] underline decoration-(--border-subtle) underline-offset-2"
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  key={`${source.title}-${source.url}`}
                >
                  {source.title} · {source.publisher}
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-6 border border-(--text-ink) p-3" aria-label="Mapa del acontecimiento">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="m-0 text-[11px] uppercase tracking-[.08em]">
              Mapa contextual
            </h3>
            <span className="font-mono text-[10px] text-(--text-muted)">
              {location?.region ?? "REGIÓN HISTÓRICA"}
            </span>
          </div>
          <svg className="h-28 w-full bg-(--background-primary)" viewBox="0 0 360 112" role="img" aria-label="Mapa esquemático de ubicación histórica">
            <path d="M25 83 65 34l48 16 37-27 53 24 48-5 72 43-52 15-61-18-47 15-51-20Z" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx={location?.x ?? 181} cy={location?.y ?? 58} r="5" fill={accent} stroke="var(--text-ink)" strokeWidth="2" />
          </svg>
        </section>

        {/* Datos expandibles con fuentes por dato */}
        <section className="border-t border-(--text-ink)">
          {[
            { label: "Datos clave", items: facts.map((f, i) => ({ text: getFactText(f), source: getFactSource(f), key: `fact-${i}` })) },
            {
              label: "Datación y contexto",
              items: [
                event.dateNote && { text: event.dateNote, source: undefined, key: "dateNote" },
                event.historicalDate && { text: `Datación histórica: ${event.historicalDate}`, source: undefined, key: "historicalDate" },
                event.chronology && { text: chronologyLabel(event.chronology), source: undefined, key: "chronology" },
              ].filter(Boolean) as { text: string; source?: TimelineFact["source"]; key: string }[],
            },
            {
              label: "Personajes y redes",
              items: event.figures?.map((f, i) => ({ text: f, source: undefined, key: `figure-${i}` })) ?? [],
            },
          ].map(({ label, items }) => (
            <div className="border-b border-(--border-subtle)" key={label}>
              <button
                className="flex w-full cursor-pointer items-center justify-between bg-transparent py-3 text-left text-[11px] font-bold uppercase tracking-[.06em]" aria-expanded={openFact === label}
                onClick={() => setOpenFact(openFact === label ? null : label)}
              >
                {label}
                <span>{openFact === label ? "−" : "+"}</span>
              </button>
              {openFact === label && (
                <div className="pb-3 text-[13px] leading-normal text-(--text-muted)">
                  {items.map((item, i) => (
                    <div className="py-1 border-b border-(--border-subtle) last:border-0" key={item.key ?? i}>
                      {renderFact(item as string | TimelineFact)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Eventos relacionados */}
        {relatedEvents.length > 0 && (
          <section className="mt-6 border-t border-(--text-ink) pt-4" aria-label="Eventos relacionados">
            <h3 className="mb-2.5 text-[11px] uppercase tracking-[.08em]">
              Eventos relacionados
            </h3>
            <ul className="space-y-2">
              {relatedEvents.map((related) => (
                <li key={related.id} className="border border-(--border-subtle) p-3">
                  <button
                    className="w-full text-left"
                    onClick={() => onNavigateEvent?.(related)}
                  >
                    <strong className="block text-sm">{related.title}</strong>
                    <span className="font-mono text-[10px] text-(--text-muted)">
                      {related.dateLabel} · {related.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Acciones: copiar cita, enlace profundo */}
        <section className="mt-6 border-t border-(--text-ink) pt-4" aria-label="Acciones">
          <h3 className="mb-2.5 text-[11px] uppercase tracking-[.08em]">
            Acciones
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              className="cursor-pointer border border-(--text-ink) bg-(--surface-pure) px-3 py-2 text-[11px] font-bold uppercase tracking-[.05em] shadow-[2px_2px_0_var(--text-ink)]"
              onClick={copyCitation}
            >
              {copied ? "¡Copiado!" : "Copiar cita"}
            </button>
            <button
              className="cursor-pointer border border-(--text-ink) bg-(--surface-pure) px-3 py-2 text-[11px] font-bold uppercase tracking-[.05em] shadow-[2px_2px_0_var(--text-ink)]"
              onClick={copyDeepLink}
            >
              {copied ? "¡Copiado!" : "Copiar enlace"}
            </button>
          </div>
        </section>

        <section className="mt-6 border-t border-(--text-ink) pt-4">
          <h3 className="mb-2.5 text-[11px] uppercase tracking-[.08em]">
            Explorar era
          </h3>
          <label className="mb-2 block font-mono text-[10px] uppercase text-(--text-muted)" htmlFor="era-select">
            Contexto temporal
          </label>
          <select
            className="w-full border border-(--text-ink) bg-(--surface-pure) p-2 text-xs"
            id="era-select"
            value={selectedEra.id}
            onChange={(change) => onEraChange(change.target.value)}
          >
            {eras.map((era) => (
              <option value={era.id} key={era.id}>
                {era.name} · {era.dateLabel}
              </option>
            ))}
          </select>
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <strong className="font-mono text-[13px]">
              {selectedEra.duration}
            </strong>
            <span className="text-right text-[11px] text-(--text-muted)">
              {selectedEra.leaders.join(" · ")}
            </span>
          </div>
          <Link
            className="mt-4 inline-block bg-(--dark-bar) px-3 py-2 text-[11px] font-bold uppercase tracking-[.06em] text-white shadow-[4px_4px_0_var(--category-prophetic)]"
            href={`/era/${selectedEra.id}`}
          >
            Ver detalle de era
          </Link>
        </section>
        <Badge tone={event.lane === "world" ? "violet" : "teal"}>
          {laneLabel(event.lane)}
        </Badge>
      </div>
    </aside>
  );
}