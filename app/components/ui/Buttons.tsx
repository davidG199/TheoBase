import type { FilterButtonProps } from "@/app/types/components";

export function FilterButton({ active = false, children, onClick }: FilterButtonProps) {
    return (
    <button 
      className={`inline-flex cursor-pointer items-center gap-1.75 border px-2.75 py-2 text-xs ${active ? "border-[#111111] bg-[#111111] text-white [&_.filter-count]:text-[#aaaaaa]" : "border-(--border-subtle) bg-transparent"}`} 
      onClick={onClick}
      >
        {children}
      </button>);
}