"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, BarChart3, Activity } from "lucide-react";
import { slideInLeft, slideInRight } from "@/lib/motion";

export function AnalyticsTeaser() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/3 h-[400px] w-[400px] rounded-full bg-primary-light/8 blur-[120px]" />
      </div>

      <div className="section-container relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Dashboard mockup */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="glass-card overflow-hidden p-6 glow-primary">
              {/* KPI Row */}
              <div className="mb-6 grid grid-cols-2 gap-3">
                {[
                  { label: "Total Bookings", value: "1,247", change: "+12.5%", icon: Activity },
                  { label: "Revenue", value: "€48,920", change: "+8.3%", icon: TrendingUp },
                  { label: "Active Travelers", value: "3,812", change: "+22.1%", icon: Users },
                  { label: "Avg. Rating", value: "4.8", change: "+0.2", icon: BarChart3 },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <kpi.icon className="h-4 w-4 text-white/30" />
                      <span className="text-[11px] font-medium text-green-400">
                        {kpi.change}
                      </span>
                    </div>
                    <p className="font-display text-xl font-bold text-white">
                      {kpi.value}
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/30">
                      {kpi.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chart mockup */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-semibold text-white/60">
                    Booking Trends — Last 12 Months
                  </p>
                  <span className="rounded-md bg-primary-light/20 px-2 py-0.5 text-[10px] font-medium text-primary-light">
                    Live
                  </span>
                </div>
                {/* SVG Chart */}
                <div className="h-32">
                  <svg viewBox="0 0 400 100" className="h-full w-full">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5FA8D3" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#5FA8D3" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,80 C30,75 60,60 100,55 C140,50 170,65 200,45 C230,25 260,40 300,30 C340,20 370,15 400,10 L400,100 L0,100 Z"
                      fill="url(#chartGrad)"
                    />
                    <path
                      d="M0,80 C30,75 60,60 100,55 C140,50 170,65 200,45 C230,25 260,40 300,30 C340,20 370,15 400,10"
                      fill="none"
                      stroke="#5FA8D3"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="mb-4 inline-block rounded-full border border-primary-light/20 bg-primary-light/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-light">
              <BarChart3 className="mr-1.5 inline-block h-3 w-3" />
              Platform Intelligence
            </span>

            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              Insights That Drive Decisions
            </h2>

            <p className="mt-4 text-base leading-relaxed text-white/50 md:text-lg">
              Real-time analytics give operators visibility into booking trends,
              peak demand windows, occupancy rates, and revenue growth — so you
              can make data-driven decisions instead of guessing.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Booking volume trends & revenue tracking",
                "Popular time slots & demand forecasting",
                "Traveler satisfaction & rating insights",
                "Occupancy rates & capacity optimization",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-light" />
                  </div>
                  <span className="text-sm text-white/60">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
