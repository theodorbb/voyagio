"use client";

import { cn } from "@/lib/utils";

// ─── Mini Bar Chart ─────────────────────────
interface BarItem {
  label: string;
  value: number;
  color?: string;
}

export function MiniBarChart({
  data,
  maxValue,
  className,
}: {
  data: BarItem[];
  maxValue?: number;
  className?: string;
}) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("space-y-2.5", className)}>
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-white/60">{item.label}</span>
            <span className="font-medium text-white/80">{item.value.toLocaleString()}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                item.color || "bg-gradient-to-r from-accent/80 to-accent-light/80"
              )}
              style={{ width: `${Math.min(100, (item.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Donut Chart (CSS-only) ─────────────────
interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  segments,
  centerLabel,
  centerValue,
  size = 160,
  className,
}: {
  segments: DonutSegment[];
  centerLabel?: string;
  centerValue?: string | number;
  size?: number;
  className?: string;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) {
    return (
      <div className={cn("flex items-center justify-center", className)} style={{ width: size, height: size }}>
        <p className="text-xs text-white/20">No data</p>
      </div>
    );
  }

  let cumulative = 0;
  const gradientParts = segments.map((seg) => {
    const start = (cumulative / total) * 360;
    cumulative += seg.value;
    const end = (cumulative / total) * 360;
    return `${seg.color} ${start}deg ${end}deg`;
  });

  const gradient = `conic-gradient(${gradientParts.join(", ")})`;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className="relative rounded-full"
        style={{
          width: size,
          height: size,
          background: gradient,
        }}
      >
        {/* Center cutout */}
        <div
          className="absolute inset-0 m-auto flex flex-col items-center justify-center rounded-full bg-[var(--background)]"
          style={{ width: size * 0.65, height: size * 0.65 }}
        >
          {centerValue !== undefined && (
            <span className="font-display text-xl font-bold text-white">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-[10px] text-white/30">{centerLabel}</span>
          )}
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5 text-xs">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-white/40">{seg.label}</span>
            <span className="font-medium text-white/60">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Ranking List ───────────────────────────
interface RankItem {
  label: string;
  sublabel?: string;
  value: string | number;
  sublabelRight?: string;
  barPercent?: number;
  barColor?: string;
}

export function RankingList({
  items,
  className,
}: {
  items: RankItem[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, i) => (
        <div
          key={`${item.label}-${i}`}
          className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
        >
          {/* Background bar */}
          {item.barPercent !== undefined && (
            <div
              className={cn(
                "absolute inset-y-0 left-0 opacity-[0.07]",
                item.barColor || "bg-accent"
              )}
              style={{ width: `${Math.min(100, item.barPercent)}%` }}
            />
          )}
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.05] text-[10px] font-bold text-white/30">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{item.label}</p>
                {item.sublabel && (
                  <p className="truncate text-[10px] text-white/30">{item.sublabel}</p>
                )}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-white">{item.value}</p>
              {item.sublabelRight && (
                <p className="text-[10px] text-white/30">{item.sublabelRight}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Section Panel ──────────────────────────
export function AnalyticsPanel({
  title,
  subtitle,
  icon: Icon,
  children,
  className,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("glass-card p-6", className)}>
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="rounded-lg bg-white/[0.05] p-2">
              <Icon className="h-4 w-4 text-white/40" />
            </div>
          )}
          <div>
            <h3 className="font-display text-sm font-bold text-white">{title}</h3>
            {subtitle && <p className="text-[10px] text-white/30">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── Status Distribution Bar ────────────────
export function StatusBar({
  segments,
  className,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
  className?: string;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  return (
    <div className={className}>
      <div className="flex h-3 overflow-hidden rounded-full">
        {total === 0 ? (
          <div className="w-full bg-white/[0.06]" />
        ) : (
          segments.map((seg) => (
            <div
              key={seg.label}
              className="transition-all duration-500"
              style={{
                width: `${(seg.value / total) * 100}%`,
                backgroundColor: seg.color,
              }}
              title={`${seg.label}: ${seg.value}`}
            />
          ))
        )}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1">
        {segments.map((seg) => (
          <span key={seg.label} className="flex items-center gap-1.5 text-xs text-white/40">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: seg.color }} />
            {seg.label} ({seg.value})
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── KPI Mini Card ──────────────────────────
export function KpiMini({
  label,
  value,
  icon: Icon,
  color = "text-white/40",
  bgColor = "bg-white/[0.05]",
}: {
  label: string;
  value: string | number;
  icon?: React.ElementType;
  color?: string;
  bgColor?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      {Icon && (
        <div className={cn("rounded-lg p-2", bgColor)}>
          <Icon className={cn("h-4 w-4", color)} />
        </div>
      )}
      <div>
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-[10px] text-white/30">{label}</p>
      </div>
    </div>
  );
}

// ─── Activity Feed Item ─────────────────────
export function FeedItem({
  icon: Icon,
  iconColor,
  title,
  subtitle,
  time,
  badge,
  badgeColor,
}: {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  subtitle?: string;
  time?: string;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg px-1 py-2">
      <div className={cn("mt-0.5 rounded-lg p-1.5", `${iconColor}/10`)}>
        <Icon className={cn("h-3.5 w-3.5", iconColor)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-white/70">{title}</p>
        {subtitle && <p className="text-[10px] text-white/30">{subtitle}</p>}
      </div>
      <div className="shrink-0 text-right">
        {badge && (
          <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", badgeColor)}>
            {badge}
          </span>
        )}
        {time && <p className="mt-0.5 text-[10px] text-white/20">{time}</p>}
      </div>
    </div>
  );
}
