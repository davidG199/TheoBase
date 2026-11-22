import type { TimeLineControlsProps, ZoomLevel } from "@/app/types/components";

const zoomLevels: Array<{ value: ZoomLevel; label: string }> = [
  { value: "era", label: "Era" },
  { value: "century", label: "Siglo" },
  { value: "decade", label: "Década" },
  { value: "year", label: "Año" },
];

export function TimeLineControls({ zoomLevel, onZoomLevelChange }: TimeLineControlsProps) {
  return <div 
    className="absolute left-1/2 top-[42%] z-3 flex -translate-x-1/2 items-center border border-(--border-subtle) bg-(--surface-pure) p-1 text-(--text-ink) shadow-[4px_4px_0_var(--text-ink)]" 
    aria-label={`Nivel temporal actual: ${zoomLevel}`}>
      {zoomLevels.map((level) => 
      <button 
        className={`h-8 min-w-16 cursor-pointer border-0 px-3 font-(--font-primary) text-xs ${zoomLevel === level.value ? "bg-(--text-ink) font-bold text-white!" : "bg-transparent text-(--text-muted)! hover:bg-(--background-primary)"}`} 
        key={level.value} 
        aria-pressed={zoomLevel === level.value} 
        onClick={() => onZoomLevelChange(level.value)}>
        {level.label}
      </button>
    )}
  </div>;
}