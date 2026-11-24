"use client";

import type { TimeLineControlsProps, ZoomLevel } from "@/app/types/components";

const zoomLevels: Array<{ value: ZoomLevel; label: string }> = [
  { value: "era", label: "Era" },
  { value: "century", label: "Siglo" },
  { value: "decade", label: "Década" },
  { value: "year", label: "Año" },
];

export function TimeLineControls({ zoomLevel, zoom, canFocusSelected, onZoomLevelChange, onFitAll, onFocusSelected, onRestart }: TimeLineControlsProps) {
  return (
    <div className="absolute left-1/2 top-[42%] z-3 flex -translate-x-1/2 flex-col items-center gap-2">
      <div
        className="flex items-center border border-(--border-subtle) bg-(--surface-pure) p-1 text-(--text-ink) shadow-[4px_4px_0_var(--text-ink)]"
        aria-label={`Nivel temporal actual: ${zoomLevel}`}
      >
        {zoomLevels.map((level) =>
          <button
            className={`h-8 min-w-16 cursor-pointer border-0 px-3 font-(--font-primary) text-xs ${zoomLevel === level.value ? "bg-(--text-ink) font-bold text-white!" : "bg-transparent text-(--text-muted)! hover:bg-(--background-primary)"}`}
            key={level.value}
            aria-pressed={zoomLevel === level.value}
            onClick={() => onZoomLevelChange(level.value)}>
            {level.label}
          </button>
        )}
        <span className="px-2 font-mono text-[10px] text-(--text-muted)" aria-live="polite">
          {Math.round(zoom)}%
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="h-7 cursor-pointer border border-(--border-subtle) bg-(--surface-pure) px-2 font-mono text-[10px] uppercase tracking-[.04em] shadow-[2px_2px_0_var(--text-ink)]"
          onClick={onFitAll}
          aria-label="Ver toda la cronología"
        >
          Ver todo
        </button>
        <button
          type="button"
          className="h-7 cursor-pointer border border-(--border-subtle) bg-(--surface-pure) px-2 font-mono text-[10px] uppercase tracking-[.04em] shadow-[2px_2px_0_var(--text-ink)]"
          onClick={onRestart}
          aria-label="Volver al inicio (4004 a.C.)"
        >
          Inicio
        </button>
        <button
          type="button"
          disabled={!canFocusSelected}
          className="h-7 cursor-pointer border border-(--border-subtle) bg-(--surface-pure) px-2 font-mono text-[10px] uppercase tracking-[.04em] shadow-[2px_2px_0_var(--text-ink)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          onClick={onFocusSelected}
          aria-label="Enfocar el evento seleccionado"
        >
          Enfocar
        </button>
      </div>
    </div>
  );
}