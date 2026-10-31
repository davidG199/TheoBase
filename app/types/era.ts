export type TimelineEra = {
  id: string;
  name: string;
  dateLabel: string;
  start: number;
  width: number;
  tint: string;
  duration: string;
  leaders: string[];
  powers: { name: string; status: "ascenso" | "pico" | "caída" }[];
};