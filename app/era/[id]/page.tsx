import Link from "next/link";
import { notFound } from "next/navigation";
import { eras } from "@/app/data/eras";
import { biblicalEvents } from "@/app/data/events/biblical";
import { Card } from "@/app/components/ui/Card";
import type { EraDetailPageProps } from "@/app/types/components";
import { eventsForEra } from "@/app/lib/timeline-utils";

const barHeightClass = (count: number, max: number): string => {
  const ratio = count / max;
  if (ratio > 0.8) return "h-full";
  if (ratio > 0.6) return "h-5/6";
  if (ratio > 0.4) return "h-3/5";
  if (ratio > 0.2) return "h-2/5";
  return "h-2";
};

export default async function EraDetailPage({ params }: EraDetailPageProps) {
  const { id } = await params;
  const era = eras.find((candidate) => candidate.id === id);
  if (!era) notFound();

  const eraEvents = eventsForEra(biblicalEvents, era.startYear, era.endYear);
  const eraSpan = Math.max(1, era.endYear - era.startYear);
  const histogram = Array.from({ length: 10 }, (_, index) => eraEvents.filter((event) => {
    const eraPosition = (event.year - era.startYear) / eraSpan;
    return eraPosition >= index / 10 && eraPosition < (index + 1) / 10;
  }).length);
  const maxHistogram = Math.max(...histogram, 1);

  return <main className="min-h-screen bg-(--background-primary) p-8 max-[800px]:p-4">
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex items-start justify-between gap-4 border-b-2 border-(--text-ink) pb-5">
        <div>
          <Link className="font-mono text-[10px] uppercase tracking-[.08em] text-(--text-muted)" href="/">← Volver a la línea temporal</Link>
          <p className="mb-2 mt-6 font-mono text-[10px] uppercase tracking-widest text-(--category-prophetic)]">
            Detalle de era
          </p>
          <h1 className="m-0 text-[clamp(36px,7vw,72px)] font-bold leading-none tracking-[-3px]">
            {era.name}
          </h1>
          <p className="mt-3 font-mono text-xs text-(--text-muted)">
            {era.dateLabel}
          </p>
          </div>
        <span className="hidden border border-(--text-ink) bg-(--surface-pure) px-3 py-2 font-mono text-[10px] uppercase md:block">Nexus / Archivo histórico</span>
      </header>
      <div className="grid grid-cols-4 gap-6 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        <Card className="col-span-2 p-6">
          <span className="font-mono text-[10px] uppercase tracking-[.08em] text-(--text-muted)">Duración</span>
          <strong className="mt-4 block  text-5xl font-bold tracking-[-2px]">
          {era.duration}
          </strong>
          <p className="mt-3 text-sm text-(--text-muted)">Periodo representado en la cronología bíblica.</p>
        </Card>
        <Card className="p-6">
          <span className="font-mono text-[10px] uppercase tracking-[.08em] text-(--text-muted)">Hitos</span>
          <strong className="mt-4 block text-5xl font-bold tracking-[-2px]">
            {String(eraEvents.length).padStart(2, "0")}
          </strong>
          <p className="mt-3 text-sm text-(--text-muted)">Acontecimientos registrados.</p>
        </Card>
        <Card className="p-6">
          <span className="font-mono text-[10px] uppercase tracking-[.08em] text-(--text-muted)">Líderes</span>
          <strong className="mt-4 block text-5xl font-bold tracking-[-2px]">
            {String(era.leaders.length).padStart(2, "0")}
          </strong>
          <p className="mt-3 text-sm text-(--text-muted)">Figuras activas en la era.</p>
        </Card>
        <Card className="col-span-2 p-6 max-[600px]:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-sm uppercase tracking-[.08em]">
              Reyes y jueces
            </h2>
          <span className="font-mono text-[10px] text-(--text-muted)">FIGURAS</span>
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-3 text-sm">
            {era.leaders.map((leader) => 
              <li className="border-l-2 border-(--category-sovereign) pl-3" key={leader}>{leader}
              </li>
            )}
          </ul>
        </Card>
        <Card className="col-span-2 p-6 max-[600px]:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-sm uppercase tracking-[.08em]">Densidad de eventos</h2>
            <span className="font-mono text-[10px] text-(--text-muted)">POR DÉCADA</span>
          </div>
          <div className="mt-6 flex h-32 items-end gap-2 border-b border-l border-[var(--text-ink)] px-3">{histogram.map((count, index) => <div className="flex flex-1 items-end" key={index}>
            <div className={`w-full bg-[var(--category-prophetic)] ${barHeightClass(count, maxHistogram)}`} title={`${count} eventos`} /></div>)}</div>
        </Card>
        <Card className="col-span-4 p-6 max-[900px]:col-span-2 max-[600px]:col-span-1"><div className="flex items-center justify-between"><h2 className="m-0 text-sm uppercase tracking-[.08em]">Potencias mundiales</h2><span className="font-mono text-[10px] text-[var(--text-muted)]">CONTEXTO GLOBAL</span></div><div className="mt-5 grid grid-cols-3 gap-4 max-[600px]:grid-cols-1">{era.powers.map((power) => <div className="border border-[var(--text-ink)] p-4" key={power.name}><strong className="block text-lg">{power.name}</strong><span className={`mt-2 inline-block px-2 py-1 font-mono text-[10px] uppercase ${power.status === "pico" ? "bg-[var(--category-sovereign)]" : power.status === "ascenso" ? "bg-[var(--category-prophetic)] text-white" : "bg-[var(--category-conflict)] text-white"}`}>{power.status}</span></div>)}</div>
        </Card>
      </div>
      <Link className="mt-8 inline-block bg-[var(--dark-bar)] px-5 py-3 text-xs font-bold uppercase tracking-[.08em] text-white shadow-[4px_4px_0_var(--category-prophetic)]" href={`/?era=${era.id}`}>Entrar en la línea temporal</Link>
    </div>
  </main>;
}
