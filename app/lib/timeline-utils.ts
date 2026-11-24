import type { TimelineEvent } from "@/app/types/events";
import type { TimelineEra } from "@/app/types/era";
import { TIMELINE_MAX_YEAR, TIMELINE_MIN_YEAR } from "@/app/lib/constants";

export const timelineEvents = (events: TimelineEvent[]): TimelineEvent[] =>
  [...events].sort((a, b) => a.year - b.year);

export const eventMatchesQuery = (event: TimelineEvent, query: string): boolean => {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return true;
  const factStrings = (event.facts ?? []).map((f) => (typeof f === "string" ? f : f.text));
  return [
    event.title,
    event.dateLabel,
    event.historicalDate ?? "",
    event.dateNote ?? "",
    event.description,
    event.scripture ?? "",
    event.period ?? "",
    event.chronology ?? "",
    event.certainty ?? "",
    ...(event.figures ?? []),
    ...(event.sources?.flatMap((source) => [source.title, source.publisher]) ?? []),
    ...factStrings,
  ]
    .some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
};

export const timelineContext = (year: number): string => {
  if (year < -2166) return "LOS COMIENZOS";
  if (year < -1805) return "LOS PATRIARCAS";
  if (year < -1051) return "ÉXODO, CONQUISTA Y JUECES";
  if (year < -586) return "REINOS Y PROFETAS";
  if (year < -332) return "EXILIO Y RETORNO";
  if (year <= TIMELINE_MAX_YEAR) return "JUDEA ROMANA Y ERA APOSTÓLICA";
  return "HISTORIA DEL CRISTIANISMO";
};

export const formatCount = (count: number): string => String(count).padStart(2, "0");

/** Año legible en convención histórica: los años negativos son a.C. */
export const formatYear = (year: number): string => (year < 0 ? `${Math.abs(year)} a.C.` : `${year} d.C.`);

/** Era que contiene un año del dominio; permite inferir el contexto de un evento. */
export const eraForYear = (eras: TimelineEra[], year: number): TimelineEra | undefined =>
  eras.find((era) => year >= era.startYear && year <= era.endYear);

/** Figuras declaradas en las eras y en los propios acontecimientos, sin duplicados. */
export const timelineFigures = (eras: TimelineEra[], events: TimelineEvent[]): string[] =>
  Array.from(new Set([
    ...eras.flatMap((era) => era.leaders),
    ...events.flatMap((event) => event.figures ?? []),
  ])).sort((a, b) => a.localeCompare(b, "es"));

export const yearToPercent = (
  year: number,
  minYear = TIMELINE_MIN_YEAR,
  maxYear = TIMELINE_MAX_YEAR,
): number => {
  if (minYear === maxYear) return 50;
  return ((year - minYear) / (maxYear - minYear)) * 100;
};

export const eventsForEra = (
  events: TimelineEvent[],
  startYear: number,
  endYear: number,
): TimelineEvent[] =>
  events.filter((event) => {
    const eventEnd = event.yearEnd ?? event.year;
    return eventEnd >= startYear && event.year <= endYear;
  });
