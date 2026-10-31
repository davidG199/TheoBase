import type { CardProps } from "@/app/types/components";

export function Card({ children, className = "" }: CardProps) {
  return <section className={`border border-[var(--border-subtle)] bg-white shadow-[4px_4px_0_#111111] ${className}`}>{children}</section>;
}