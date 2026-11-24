"use client";

import type { EventMarkerProps } from "@/app/types/components";

export function EventMarker({ event, x, labelX, verticalOffset = 0, selected, showLabel, onSelect, isSync }: EventMarkerProps) {
  const categoryClass = {
    prophetic: "bg-[var(--category-prophetic)]",
    conflict: "bg-[var(--category-conflict)]",
    sovereign: "bg-[var(--category-sovereign)]",
    world: "bg-[var(--category-world)]",
    council: "bg-[var(--category-council)]",
    reform: "bg-[var(--category-reform)]",
    mission: "bg-[var(--category-mission)]",
  }[event.category];
  const nodeTop = event.lane === "biblical" ? "35%" : "25%";
  const labelTop = event.above ? (event.lane === "world" ? "8%" : "18%") : event.lane === "biblical" ? "43%" : "34%";

  const syncClass = isSync ? "ring-2 ring-(--category-conflict) ring-offset-2 ring-offset-(--background-primary)" : "";
  const syncLabelClass = isSync ? "ring-1 ring-(--category-conflict)" : "";

  return (
    <div key={event.id}>
      <button
        className={`absolute z-2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-(--background-primary) shadow-[4px_4px_0_var(--text-ink)] transition-transform hover:scale-[1.2] ${event.importance === "major" ? "size-6" : "size-3"} ${categoryClass} ${selected ? "scale-[1.35] shadow-[2px_2px_0_var(--text-ink)]" : ""} ${syncClass}`}
        style={{ left: `${x}px`, top: `calc(${nodeTop} + ${verticalOffset}px)` }}
        aria-label={`Ver ${event.title}${isSync ? " (sincronizado)" : ""}`}
        data-event-id={event.id}
        onClick={() => onSelect(event)}
      />

      {showLabel &&
        <button
          className={`absolute w-42.5 -translate-x-1/2 cursor-pointer border-0 bg-[rgba(244,244,240,.92)] px-1 text-center text-[11px] leading-tight ${syncLabelClass}`}
          style={{ left: `${labelX ?? x}px`, top: `calc(${labelTop} + ${verticalOffset}px)` }}
          data-event-label={event.id}
          onClick={() => onSelect(event)}
        >
          <strong className="block font-bold">
            {event.title}
          </strong>
          <span className="mt-1 block font-mono text-[11px] text-(--text-muted)">
            {event.dateLabel}
          </span>
        </button>
      }
    </div>
  );
}