import type { TimelineSource } from "@/app/types/events";
import { TIMELINE_BOOK_SOURCE_URL } from "@/app/lib/constants";

/**
 * Obra de referencia usada como base para la cronología tradicional,
 * la selección de acontecimientos y los datos curiosos del corpus.
 */
export const bookSource: TimelineSource = {
  title: "Líneas de tiempo bíblicas y de la historia del cristianismo",
  publisher: "Rose Publishing",
  url: TIMELINE_BOOK_SOURCE_URL,
};

export const britannica = (title: string, path: string): TimelineSource => ({
  title,
  publisher: "Encyclopaedia Britannica",
  url: `https://www.britannica.com/${path}`,
});

export const metMuseum = (title: string, path: string): TimelineSource => ({
  title,
  publisher: "The Metropolitan Museum of Art",
  url: `https://www.metmuseum.org/${path}`,
});

export const britishMuseum = (title: string, objectId: string): TimelineSource => ({
  title,
  publisher: "The British Museum",
  url: `https://www.britishmuseum.org/collection/object/${objectId}`,
});
