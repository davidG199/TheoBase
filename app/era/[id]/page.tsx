import { notFound } from "next/navigation";
import { eras } from "@/app/data/eras";
import { biblicalEvents } from "@/app/data/events/biblical";
import { worldEvents } from "@/app/data/events/world";
import { eventsForEra } from "@/app/lib/timeline-utils";
import { EraDetailContent } from "./page-client";
import type { EraDetailPageProps } from "@/app/types/components";

export default async function EraDetailPage({ params }: EraDetailPageProps) {
  const { id } = await params;
  const era = eras.find((candidate) => candidate.id === id);
  if (!era) notFound();

  const currentIndex = eras.findIndex((e) => e.id === id);
  const prevEra = currentIndex > 0 ? eras[currentIndex - 1] : null;
  const nextEra = currentIndex < eras.length - 1 ? eras[currentIndex + 1] : null;

  const eraBiblicalEvents = eventsForEra(biblicalEvents, era.startYear, era.endYear);
  const eraWorldEvents = eventsForEra(worldEvents, era.startYear, era.endYear);

  // Highlights from era data + events
  const highlights = era.highlights ?? [];
  const allHighlights = [
    ...highlights.map((h) => ({ ...h, source: "era" as const })),
    ...eraBiblicalEvents
      .filter((e) => e.importance === "major")
      .map((e) => ({
        id: e.id,
        title: e.title,
        dateLabel: e.dateLabel,
        year: e.year,
        category: e.category,
        lane: e.lane as "biblical" | "world",
        description: e.description,
        source: "event" as const,
      })),
    ...eraWorldEvents
      .filter((e) => e.importance === "major")
      .map((e) => ({
        id: e.id,
        title: e.title,
        dateLabel: e.dateLabel,
        year: e.year,
        category: e.category,
        lane: e.lane as "biblical" | "world",
        description: e.description,
        source: "event" as const,
      })),
  ].sort((a, b) => a.year - b.year);

  return (
    <EraDetailContent
      era={era}
      prevEra={prevEra}
      nextEra={nextEra}
      currentIndex={currentIndex}
      allHighlights={allHighlights}
    />
  );
}