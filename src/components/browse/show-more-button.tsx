"use client";

import { ChevronDown } from "lucide-react";

export function ShowMoreButton({
  remaining,
  totalLabel,
  onClick,
  label = "Show more",
}: {

  remaining: number;

  totalLabel?: string;
  onClick: () => void;
  label?: string;
}) {
  if (remaining <= 0) return null;
  return (
    <div className="mt-10 flex justify-center">
      <button
        onClick={onClick}
        className="group inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/70 backdrop-blur-sm transition-all hover:border-accent/40 hover:bg-accent/[0.08] hover:text-white"
      >
        {label}
        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-white/50">
          +{remaining}
          {totalLabel ? ` ${totalLabel}` : ""}
        </span>
        <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
      </button>
    </div>
  );
}
