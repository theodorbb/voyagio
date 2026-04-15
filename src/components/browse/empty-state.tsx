"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your search or filters to find what you're looking for.",
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center py-20 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
        <Compass className="h-7 w-7 text-white/20" />
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold text-white/70">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-white/40">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
