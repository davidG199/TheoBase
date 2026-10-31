export type NavbarProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onSearchOpen: () => void;
  lane: import("./events").TimelineFilter;
  onLaneChange: (lane: import("./events").TimelineFilter) => void;
};

export type FilterButtonProps = {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
};

export type BadgeProps = {
  children: React.ReactNode;
  tone?: "neutral" | "teal" | "violet";
};

export type TimeLineCanvasProps = {
  eras: import("./era").TimelineEra[];
  events: import("./events").TimelineEvent[];
  zoom: number;
  zoomLevel: ZoomLevel;
  selectedId?: string;
  onZoomChange: (zoom: number) => void;
  onZoomLevelChange: (level: ZoomLevel) => void;
  onSelect: (event: import("./events").TimelineEvent) => void;
};

export type TimelineCanvasWithScrubberProps = TimeLineCanvasProps & Pick<TimeLineScrubberProps, "currentYear" | "isPlaying" | "onYearChange" | "onTogglePlayback">;

export type EventMarkerProps = {
  event: import("./events").TimelineEvent;
  left: number;
  verticalOffset?: number;
  selected: boolean;
  onSelect: (event: import("./events").TimelineEvent) => void;
};

export type ZoomLevel = "era" | "century" | "decade" | "year";

export type TimeLineControlsProps = {
  zoomLevel: ZoomLevel;
  onZoomLevelChange: (level: ZoomLevel) => void;
};

export type TimeLineScrubberProps = {
  currentYear: number;
  minYear: number;
  maxYear: number;
  isPlaying: boolean;
  onYearChange: (year: number) => void;
  onTogglePlayback: () => void;
};

export type ContextPanelProps = {
  event: import("./events").TimelineEvent;
  eras: import("./era").TimelineEra[];
  selectedEra: import("./era").TimelineEra;
  onClose: () => void;
  onEraChange: (eraId: string) => void;
};

export type SearchMatrixProps = {
  query: string;
  eras: import("./era").TimelineEra[];
  events: import("./events").TimelineEvent[];
  onQueryChange: (query: string) => void;
  onClose: () => void;
  onSelectEvent: (event: import("./events").TimelineEvent) => void;
};

export type TimelineProps = {
  query: string;
  focusEventId?: string;
  focusYear?: number;
  lane: import("./events").TimelineFilter;
};

export type ResultColumnProps = {
  title: string;
  count: number;
  children: React.ReactNode;
};

export type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export type EraDetailPageProps = {
  params: Promise<{ id: string }>;
};
