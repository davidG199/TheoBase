import type { TimelineEra } from "@/app/types/era";

export const eras: TimelineEra[] = [
  { id: "patriarchs", name: "Patriarcas", dateLabel: "4004–1446 a.C.", start: 0, width: 28, tint: "rgba(212,175,55,.13)", duration: "2.558 años", leaders: ["Abraham", "Isaac", "Jacob", "José"], powers: [{ name: "Egipto", status: "pico" }, { name: "Babilonia", status: "ascenso" }] },
  { id: "exodus", name: "Éxodo y Ley", dateLabel: "1446–1000 a.C.", start: 28, width: 18, tint: "rgba(0,128,128,.09)", duration: "446 años", leaders: ["Moisés", "Josué", "Débora", "Samuel"], powers: [{ name: "Egipto", status: "caída" }, { name: "Filistea", status: "pico" }] },
  { id: "kingdom", name: "Reino unido", dateLabel: "1000–586 a.C.", start: 46, width: 18, tint: "rgba(212,175,55,.13)", duration: "414 años", leaders: ["Saúl", "David", "Salomón"], powers: [{ name: "Israel", status: "pico" }, { name: "Asiria", status: "ascenso" }] },
  { id: "exile", name: "Exilio y retorno", dateLabel: "586–1 a.C.", start: 64, width: 14, tint: "rgba(102,51,153,.08)", duration: "585 años", leaders: ["Daniel", "Esdras", "Nehemías"], powers: [{ name: "Babilonia", status: "pico" }, { name: "Persia", status: "ascenso" }] },
  { id: "messiah", name: "Era del Mesías", dateLabel: "0–70 d.C.", start: 78, width: 22, tint: "rgba(0,128,128,.1)", duration: "70 años", leaders: ["Jesús", "Pedro", "Pablo"], powers: [{ name: "Roma", status: "pico" }, { name: "Judea", status: "caída" }] },
];