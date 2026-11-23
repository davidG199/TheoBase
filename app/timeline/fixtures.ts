import type { EventCategory, TimelineEvent } from "@/app/types/events";
import { TIMELINE_MAX_YEAR, TIMELINE_MIN_YEAR } from "@/app/lib/constants";

/**
 * Genera eventos sintéticos deterministas para medir el rendimiento del lienzo.
 * Solo se usa en desarrollo mediante `?fixtures=500|1000|5000`.
 */
export const buildFixtureEvents = (count: number): TimelineEvent[] => {
  let seed = 20261123;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const span = TIMELINE_MAX_YEAR - TIMELINE_MIN_YEAR;
  const biblicalCategories: EventCategory[] = ["prophetic", "conflict", "sovereign"];

  return Array.from({ length: count }, (_, index) => {
    const year = Math.round(TIMELINE_MIN_YEAR + random() * span);
    const lane = index % 2 === 0 ? "biblical" : "world";
    const category: EventCategory = lane === "world" ? "world" : biblicalCategories[index % biblicalCategories.length];
    const major = index % 7 === 0;
    return {
      id: `fixture-${index}`,
      title: `Evento sintético ${String(index + 1).padStart(4, "0")}`,
      dateLabel: year < 0 ? `${Math.abs(year)} a.C.` : `${year} d.C.`,
      year,
      lane,
      category,
      color: "#111111",
      description: "Evento generado para las pruebas de escala del lienzo.",
      facts: ["Fixture de rendimiento"],
      importance: major ? "major" : "minor",
      figures: [],
    } satisfies TimelineEvent;
  });
};
