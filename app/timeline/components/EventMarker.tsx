import type { EventMarkerProps } from "@/app/types/components";

export function EventMarker({ event, left, verticalOffset = 0, selected, onSelect }: EventMarkerProps) {
  const categoryClass = {
    prophetic: "bg-[var(--category-prophetic)]",
    conflict: "bg-[var(--category-conflict)]",
    sovereign: "bg-[var(--category-sovereign)]",
    world: "bg-[var(--category-world)]",
  }[event.category];
  const nodeTop = event.lane === "biblical" ? "35%" : "25%";
  const labelTop = event.above ? (event.lane === "world" ? "8%" : "18%") : event.lane === "biblical" ? "43%" : "34%";

  return <div key={event.id} title={`${event.title} · ${event.dateLabel}`}>
    <button className={`absolute z-[2] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-[var(--background-primary)] shadow-[4px_4px_0_var(--text-ink)] transition-transform hover:scale-[1.2] ${event.importance === "major" ? "size-6" : "size-3"} ${categoryClass} ${selected ? "scale-[1.35] shadow-[2px_2px_0_var(--text-ink)]" : ""}`} style={{ left: `${left}%`, top: `calc(${nodeTop} + ${verticalOffset}px)` }} aria-label={`Ver ${event.title}`} onClick={() => onSelect(event)} />
    <button className="absolute w-[170px] -translate-x-1/2 cursor-pointer border-0 bg-[rgba(244,244,240,.85)] px-1 text-center text-[11px] leading-tight" style={{ left: `${left}%`, top: `calc(${labelTop} + ${verticalOffset}px)` }} onClick={() => onSelect(event)}>
      <strong className="block font-bold">{event.title}</strong>
      <span className="mt-1 block font-mono text-[11px] text-[var(--text-muted)]">{event.dateLabel}</span>
    </button>
  </div>;
}
