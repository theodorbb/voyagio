"use client";

import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}

export function FilterChip({ label, active, onClick, count }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300",
        active
          ? "border-accent/40 bg-accent/15 text-accent"
          : "border-white/[0.08] bg-white/[0.03] text-white/50 hover:border-white/[0.15] hover:text-white/70"
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold", active ? "bg-accent/20" : "bg-white/[0.06]")}>
          {count}
        </span>
      )}
    </button>
  );
}
