export type EraPower = {
  name: string;
  status: "ascenso" | "pico" | "caída";
};

export type EraSubPeriod = {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  rulers: string[];
  prophets: string[];
  description?: string;
};

export type EraHighlight = {
  id: string;
  title: string;
  dateLabel: string;
  year: number;
  category: import("./events").EventCategory;
  lane: import("./events").EventLane;
  description: string;
};

export type TimelineEra = {
  id: string;
  name: string;
  dateLabel: string;
  /** Posición visual de la banda en la línea de tiempo (porcentaje). */
  start: number;
  width: number;
  /** Rango histórico real, usado para búsquedas y páginas de detalle. */
  startYear: number;
  endYear: number;
  tint: string;
  duration: string;
  leaders: string[];
  powers: EraPower[];
  /** Subperíodos internos (dinastías, fases, etc.) */
  subPeriods?: EraSubPeriod[];
  /** Hitos destacados de la era (eventos principales) */
  highlights?: EraHighlight[];
  /** Contexto mundial estructurado */
  worldContext?: {
    summary: string;
    parallelEvents: EraHighlight[];
  };
};
