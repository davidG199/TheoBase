import type { TimelineEvent } from "@/app/types/events";
import { TIMELINE_MAX_YEAR, TIMELINE_MIN_YEAR } from "@/app/lib/constants";

export const timelineEvents = (events: TimelineEvent[]): TimelineEvent[] =>
  [...events].sort((a, b) => a.year - b.year);

export const eventMatchesQuery = (event: TimelineEvent, query: string): boolean => {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return true;
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
    ...event.facts,
  ]
    .some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
};

export const eventPosition = (
  event: TimelineEvent,
  minYear = TIMELINE_MIN_YEAR,
  maxYear = TIMELINE_MAX_YEAR,
): number => 3 + yearToPercent(event.year, minYear, maxYear) * 0.94;

export const timelineBounds = (events: TimelineEvent[]): { minYear: number; maxYear: number } => {
  if (!events.length) return { minYear: TIMELINE_MIN_YEAR, maxYear: TIMELINE_MAX_YEAR };

  const years = events.flatMap((event) => [event.year, event.yearEnd ?? event.year]);
  return {
    minYear: Math.min(...years),
    maxYear: Math.max(...years),
  };
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
