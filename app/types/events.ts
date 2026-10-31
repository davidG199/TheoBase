export type EventCategory = "prophetic" | "conflict" | "sovereign" | "world";
export type EventLane = "biblical" | "world";
export type TimelineFilter = EventLane | "all" | "conflict" | "prophecy" | "royalty";

export type TimelineEvent = {
  id: string;
  title: string;
  dateLabel: string;
  year: number;
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