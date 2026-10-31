import type { TimelineEvent } from "@/app/types/events";

export const timelineEvents = (events: TimelineEvent[]): TimelineEvent[] =>
  [...events].sort((a, b) => a.year - b.year);

export const eventMatchesQuery = (event: TimelineEvent, query: string): boolean => {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return true;
  return [event.title, event.dateLabel, event.description, event.scripture ?? "", ...event.facts]
    .some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
};

export const eventPosition = (event: TimelineEvent, minYear = -4004, maxYear = 70): number =>
  3 + yearToPercent(event.year, minYear, maxYear) * 0.94;

export const timelineBounds = (events: TimelineEvent[]): { minYear: number; maxYear: number } => {
  const years = events.map((event) => event.year);
  const minYear = years.length ? Math.min(...years) : 0;
  const eventMaxYear = years.length ? Math.max(...years) : 0;
  const eventSpan = Math.max(1, eventMaxYear - minYear);
  return {
    minYear,
    maxYear: eventMaxYear + eventSpan * 0.12,
  };
};

export const timelineContext = (year: number): string => {
  if (year < -2348) return "EARLY GENESIS";
  if (year < -1446) return "THE PATRIARCHS";
  if (year < -1000) return "THE EXODUS";
  if (year < -586) return "THE UNITED MONARCHY";
  if (year < -4) return "EXILE & RETURN";
  if (year <= 70) return "THE MESSIANIC ERA";
  return "THE EARLY CHURCH";
};

export const formatCount = (count: number): string => String(count).padStart(2, "0");

export const yearToPercent = (year: number, minYear = -4004, maxYear = 70): number => {
  if (minYear === maxYear) return 50;
  return ((year - minYear) / (maxYear - minYear)) * 100;
};

export const eventsForEra = (events: TimelineEvent[], eraStartPercent: number, eraWidthPercent: number): TimelineEvent[] =>
  events.filter((event) => {
    const position = yearToPercent(event.year);
    return position >= eraStartPercent && position <= eraStartPercent + eraWidthPercent;
  });