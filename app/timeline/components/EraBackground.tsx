import type { TimelineEra } from "@/app/types/era";

export function EraBackground({ era }: { era: TimelineEra }) {
  return <div className="absolute top-[53%] h-12" style={{ left: `${era.start}%`, width: `${era.width}%`, background: era.tint }}>
    <div className="px-3 py-2.25 text-xs font-bold text-(--text-muted)">
      <span className="sr-only">
        Era: 
      </span>
      {era.name}
      <small className="mt-0.75 block font-mono text-[9px] font-normal">
      {era.dateLabel}
    </small>
    </div>
  </div>;
}
