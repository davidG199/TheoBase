export type EventCategory =
  | "prophetic"
  | "conflict"
  | "sovereign"
  | "world"
  | "council"
  | "reform"
  | "mission";
export type EventLane = "biblical" | "world" | "church";
export type TimelineFilter = EventLane | "all" | "conflict" | "prophecy" | "royalty";
export type TimelineChronology = "biblical-traditional" | "historical" | "mixed";
export type TimelineCertainty = "established" | "approximate" | "disputed";
export type TimelineEvidence =
  | "biblical-text"
  | "archaeological"
  | "inscription"
  | "literary"
  | "historical-reconstruction"
  | "mixed";

export type TimelineSource = {
  title: string;
  publisher: string;
  url: string;
};

export type TimelineEvent = {
  id: string;
  title: string;
  dateLabel: string;
  year: number;
  yearEnd?: number;
  /** Fecha o estimación histórica moderna cuando difiere de la fecha tradicional del libro. */
  historicalYear?: number;
  /** Etiqueta legible de la datación histórica alternativa. */
  historicalDate?: string;
  /** Explicación breve de la datación: tradición, consenso o debate. */
  dateNote?: string;
  displayYear?: string;
  period?: string;
  chronology?: TimelineChronology;
  certainty?: TimelineCertainty;
  evidenceType?: TimelineEvidence;
  sources?: TimelineSource[];
  /** Personajes clave asociados al acontecimiento. */
  figures?: string[];
  lane: EventLane;
  category: EventCategory;
  color: string;
  description: string;
  scripture?: string;
  facts: string[];
  importance: "major" | "minor";
  above?: boolean;
  relatedEventIds?: string[];
};
