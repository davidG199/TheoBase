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
  powers: { name: string; status: "ascenso" | "pico" | "caída" }[];
};
