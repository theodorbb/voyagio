"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  CalendarDays,
  DollarSign,
  GripVertical,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { slideInLeft, slideInRight } from "@/lib/motion";

export function TripBuilderPromo() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]" />
      </div>

      <div className="section-container relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Content */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="mb-4 inline-block rounded-full border border-primary-light/20 bg-primary-light/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-light">
              <Sparkles className="mr-1.5 inline-block h-3 w-3" />
              Killer Feature
            </span>

            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              Smart Trip Builder
            </h2>

            <p className="mt-4 text-base leading-relaxed text-white/50 md:text-lg">
              Tell us your destination, travel dates, budget, and interests — and
              Voyagio generates a personalized day-by-day itinerary in seconds.
              Drag and drop to customize, see real-time cost estimates, and book
              everything in one place.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: Sparkles,
                  title: "AI-Powered Suggestions",
                  description:
                    "Activities matched to your travel style, interests, and group size.",
                },
                {
                  icon: CalendarDays,
                  title: "Day-by-Day Planning",
                  description:
                    "Visual timeline with smart scheduling based on location and duration.",
                },
                {
                  icon: DollarSign,
                  title: "Budget Awareness",
                  description:
                    "Live cost tracking as you add activities to your itinerary.",
                },
              ].map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary-light/20 bg-primary-light/10">
                    <feature.icon className="h-5 w-5 text-primary-light" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {feature.title}
                    </h4>
                    <p className="mt-0.5 text-sm text-white/40">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard/trip-builder"
              className="btn-primary mt-8 inline-flex"
            >
              Try the Trip Builder
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Right: Visual mockup */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="glass-card relative overflow-hidden p-6 glow-primary">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/40">Your Trip</p>
                  <h3 className="font-display text-lg font-bold text-white">
                    3 Days in Lisbon
                  </h3>
                </div>
                <div className="rounded-lg border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
                  €185 total
                </div>
              </div>

              {/* Day cards */}
              {[
                {
                  day: "Day 1",
                  label: "Explore & Taste",
                  activities: [
                    { name: "Alfama Walking Tour", time: "09:00", duration: "3h", price: "€25" },
                    { name: "Pastéis de Belém Tasting", time: "13:00", duration: "1.5h", price: "€15" },
                    { name: "Sunset Kayak Tour", time: "16:30", duration: "3h", price: "€45" },
                  ],
                },
                {
                  day: "Day 2",
                  label: "Culture & Views",
                  activities: [
                    { name: "Sintra Palace Day Trip", time: "08:30", duration: "6h", price: "€55" },
                    { name: "Fado Night Experience", time: "20:00", duration: "2h", price: "€35" },
                  ],
                },
              ].map((day) => (
                <div
                  key={day.day}
                  className="mb-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-primary-light/20 px-2 py-0.5 text-xs font-bold text-primary-light">
                        {day.day}
                      </span>
                      <span className="text-xs text-white/40">{day.label}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {day.activities.map((activity) => (
                      <div
                        key={activity.name}
                        className="group flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]"
                      >
                        <GripVertical className="h-3.5 w-3.5 shrink-0 text-white/20" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white/80">
                            {activity.name}
                          </p>
                          <div className="mt-0.5 flex items-center gap-3 text-[11px] text-white/30">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {activity.time}
                            </span>
                            <span>{activity.duration}</span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-accent-light">
                          {activity.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Gradient overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--surface)] to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
