"use client";

import { useMemo } from "react";
import type { TimeLineScrubberProps } from "@/app/types/components";
import type { TimelineEra } from "@/app/types/era";
import type { TimelineEvent } from "@/app/types/events";

const formatYear = (year: number): string => year < 0 ? `${Math.abs(year)} a.C.` : `${year} d.C.`;

const DEFAULT_SPEEDS = [50, 100, 200, 500, 1000];

export function TimeLineScrubber({ 
  currentYear, 
  minYear, 
  maxYear, 
  isPlaying, 
  onYearChange, 
  onTogglePlayback,
  playbackSpeed = 100,
  onSpeedChange,
  onJumpTo,
  onRestart,
  eras = [],
  events = [],
}: TimeLineScrubberProps) {
  const eraOptions = useMemo(() => 
    eras.map((era) => ({ value: era.id, label: `${era.name} (${formatYear(era.startYear)}–${formatYear(era.endYear)})` }))
  , [eras]);

  const eventOptions = useMemo(() => 
    events
      .filter((e) => e.importance === "major")
      .slice(0, 50)
      .map((e) => ({ value: e.id, label: `${e.title} — ${e.dateLabel}` }))
  , [events]);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-3 flex h-12 items-center gap-3 bg-(--dark-bar) px-4 text-white" role="group" aria-label="Controles de reproducción">
      <button 
        className="grid size-7 shrink-0 cursor-pointer place-items-center border border-white/40 bg-transparent text-sm" 
        aria-label={isPlaying ? "Pausar reproducción" : "Reproducir línea temporal"} 
        onClick={onTogglePlayback}>
        {isPlaying ? "Ⅱ" : "▶"}
      </button>
      
      <button
        type="button"
        className="grid size-7 shrink-0 cursor-pointer place-items-center border border-white/40 bg-transparent text-sm"
        aria-label="Reiniciar al inicio"
        onClick={onRestart}
        title="Reiniciar (Home)"
      >
        ↺
      </button>

      <span className="min-w-19.5 font-mono text-[10px]">
        {formatYear(currentYear)}
      </span>
      
      <label className="sr-only" htmlFor="timeline-scrubber">
        Navegar por el tiempo
      </label>
      <input 
        id="timeline-scrubber" 
        className="h-1 min-w-0 flex-1 accent-(--category-prophetic)" 
        type="range" 
        min={minYear} 
        max={maxYear} 
        value={currentYear} 
        onChange={(event) => onYearChange(Number(event.target.value))} 
        aria-label={`Año actual: ${formatYear(currentYear)}`} 
      />
      <span className="font-mono text-[10px] text-[#c4c7c7]">
        {formatYear(maxYear)}
      </span>

      <div className="flex items-center gap-2 border-l border-white/20 pl-3">
        <label className="sr-only" htmlFor="playback-speed">
          Velocidad de reproducción
        </label>
        <select
          id="playback-speed"
          className="bg-transparent border border-white/20 text-white text-[10px] px-2 py-1 rounded"
          value={playbackSpeed}
          onChange={(e) => onSpeedChange?.(Number(e.target.value))}
          aria-label="Velocidad de reproducción (años por paso)"
        >
          {DEFAULT_SPEEDS.map((speed) => (
            <option key={speed} value={speed}>
              {speed} años/paso
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 border-l border-white/20 pl-3">
        <label className="sr-only" htmlFor="jump-to-era">
          Saltar a era
        </label>
        <select
          id="jump-to-era"
          className="bg-transparent border border-white/20 text-white text-[10px] px-2 py-1 rounded"
          onChange={(e) => onJumpTo?.({ type: "era", eraId: e.target.value })}
          aria-label="Saltar a una era"
        >
          <option value="">— Ir a era —</option>
          {eraOptions.map((era) => (
            <option key={era.value} value={era.value}>
              {era.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 border-l border-white/20 pl-3 max-[600px]:hidden">
        <label className="sr-only" htmlFor="jump-to-event">
          Saltar a evento principal
        </label>
        <select
          id="jump-to-event"
          className="bg-transparent border border-white/20 text-white text-[10px] px-2 py-1 rounded max-w-[200px]"
          onChange={(e) => onJumpTo?.({ type: "event", eventId: e.target.value })}
          aria-label="Saltar a un evento principal"
        >
          <option value="">— Ir a evento —</option>
          {eventOptions.map((event) => (
            <option key={event.value} value={event.value}>
              {event.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 border-l border-white/20 pl-3">
        <label className="sr-only" htmlFor="jump-to-year">
          Año específico
        </label>
        <input
          id="jump-to-year"
          type="number"
          min={minYear}
          max={maxYear}
          step={1}
          className="bg-transparent border border-white/20 text-white text-[10px] px-2 py-1 rounded w-20"
          placeholder={formatYear(currentYear)}
          onBlur={(e) => { const v = Number(e.target.value); if (Number.isFinite(v) && v >= minYear && v <= maxYear) onJumpTo?.({ type: "year", year: v }); }}
          onKeyDown={(e) => { if (e.key === "Enter") { const v = Number(e.currentTarget.value); if (Number.isFinite(v) && v >= minYear && v <= maxYear) onJumpTo?.({ type: "year", year: v }); }}}
          aria-label="Ir a año específico"
        />
      </div>
    </div>
  );
}