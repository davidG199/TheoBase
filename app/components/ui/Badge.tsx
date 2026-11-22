import type { BadgeProps } from "@/app/types/components";

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  const toneClass = tone === "teal" ? "bg-[rgba(0,128,128,.12)] text-[var(--category-prophetic)]" : tone === "violet" ? "bg-[rgba(102,51,153,.12)] text-[var(--category-world)]" : "bg-[#e8e8e4]";
  return (
      <span className={`mt-6 inline-block px-2.25 py-1.5 font-mono text-[10px] uppercase tracking-[.05em] ${toneClass}`}>
        {children}
        </span>);
}