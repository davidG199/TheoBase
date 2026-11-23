import type { TimelineEra } from "@/app/types/era";

export function EraBackground({ era, left, width }: { era: TimelineEra; left: number; width: number }) {
  return (
    <div className="absolute top-[53%] h-12" style={{ left: `${left}px`, width: `${Math.max(width, 2)}px`, background: era.tint }}>
      <div className="px-3 py-2.25 overflow-hidden text-xs font-bold text-(--text-muted)">
        <span className="sr-only">
          Era:
        </span>
        {era.name}
        <small className="mt-0.75 block font-mono text-[9px] font-normal">
          {era.dateLabel}
        </small>
      </div>
    </div>
  );
}
