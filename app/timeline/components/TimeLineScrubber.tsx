import type { TimeLineScrubberProps } from "@/app/types/components";

const formatYear = (year: number): string => year < 0 ? `${Math.abs(year)} a.C.` : `${year} d.C.`;

export function TimeLineScrubber({ currentYear, minYear, maxYear, isPlaying, onYearChange, onTogglePlayback }: TimeLineScrubberProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-3 flex h-12 items-center gap-3 bg-(--dark-bar) px-4 text-white">
      <button 
        className="grid size-7 shrink-0 cursor-pointer place-items-center border border-white/40 bg-transparent text-sm" 
        aria-label={isPlaying ? "Pausar reproducción" : "Reproducir línea temporal"} 
        onClick={onTogglePlayback}>
        {isPlaying ? "Ⅱ" : "▶"}
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
        onChange={(event) => onYearChange(Number(event.target.value))} />
      <span className="font-mono text-[10px] text-[#c4c7c7]">
        {formatYear(maxYear)}
      </span>
  </div>
  );
}
