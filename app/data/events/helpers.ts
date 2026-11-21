import type {
  EventCategory,
  EventLane,
  TimelineEvent,
} from "@/app/types/events";

export const categoryColors: Record<EventCategory, string> = {
  prophetic: "var(--category-prophetic)",
  conflict: "var(--category-conflict)",
  sovereign: "var(--category-sovereign)",
  world: "var(--category-world)",
  council: "var(--category-council)",
  reform: "var(--category-reform)",
  mission: "var(--category-mission)",
};

type EventSeed = Omit<TimelineEvent, "lane" | "color">;

export const makeEvent = (lane: EventLane, seed: EventSeed): TimelineEvent => ({
  ...seed,
  lane,
  color: categoryColors[seed.category],
});

/** Constructor de eventos de la narrativa bíblica. */
export const biblicalEvent = (seed: EventSeed): TimelineEvent => makeEvent("biblical", seed);

/** Constructor de eventos de contexto mundial. */
export const worldEvent = (seed: EventSeed): TimelineEvent => makeEvent("world", seed);

/** Constructor de eventos de historia del cristianismo (corpus preparado). */
export const churchEvent = (seed: EventSeed): TimelineEvent => makeEvent("church", seed);
