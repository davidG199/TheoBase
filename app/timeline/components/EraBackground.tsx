import type { TimelineEra } from "@/app/types/era";

export function EraBackground({ era }: { era: TimelineEra }) {
  const eraClass = {
    patriarchs: "left-0 w-[28%]",
    exodus: "left-[28%] w-[18%]",
    kingdom: "left-[46%] w-[18%]",
    exile: "left-[64%] w-[14%]",
    messiah: "left-[78%] w-[22%]",
  }[era.id] ?? "left-0 w-full";

  return <div className={`absolute top-[53%] h-12 ${eraClass}`}>
    <div className="px-3 py-[9px] text-xs font-bold text-[var(--text-muted)]"><span className="sr-only">Era: </span>{era.name}<small className="mt-[3px] block font-mono text-[9px] font-normal">{era.dateLabel}</small></div>
  </div>;
}