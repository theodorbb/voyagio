"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "accent" | "primary" | "green" | "purple";
  className?: string;
}

const colorMap = {
  accent: {
    bg: "bg-accent/10",
    text: "text-accent",
    glow: "shadow-accent/5",
  },
  primary: {
    bg: "bg-primary-light/10",
    text: "text-primary-light",
    glow: "shadow-primary-light/5",
  },
  green: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/5",
  },
  purple: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    glow: "shadow-violet-500/5",
  },
};

export function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  color = "accent",
  className,
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        "glass-card p-6 transition-all duration-300 hover:border-white/[0.12] hover:shadow-lg",
        colors.glow,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/40">{label}</p>
          <p className="mt-1 font-display text-3xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-white/30">{subtitle}</p>
          )}
        </div>
        <div className={cn("rounded-xl p-2.5", colors.bg)}>
          <Icon className={cn("h-5 w-5", colors.text)} />
        </div>
      </div>
    </motion.div>
  );
}
