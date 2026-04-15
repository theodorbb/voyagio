"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Compass,
  Wallet,
  Star,
  MapPin,
  Map as MapIcon,
  CloudSun,
  Utensils,
  Mountain,
  Palette,
  Waves,
  Camera,
  Heart,
  Moon,
  TreePine,
  ExternalLink,
} from "lucide-react";
import { fadeInUp, fadeIn, staggerContainer } from "@/lib/motion";
import { VoyagioMap } from "@/components/maps/voyagio-map";
import { WeatherWidget } from "@/components/weather/weather-widget";

// ─── Types ──────────────────────────────────

interface TripActivity {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  currency: string;
  duration: number;
  rating: number;
  reviewCount: number;
  difficulty: string | null;
  images: string;
  description: string;
  timeOfDay: string | null;
  startTime: string | null;
  latitude: number;
  longitude: number;
}

interface TripData {
  id: string;
  name: string;
  summary: string | null;
  status: string;
  budget: number | null;
  startDate: string;
  endDate: string;
  destination: {
    name: string;
    slug: string;
    country: string;
    coverImage: string;
    latitude: number;
    longitude: number;
  };
  preferences: Record<string, unknown>;
  days: number;
  itinerary: Array<{
    dayNumber: number;
    activities: TripActivity[];
  }>;
  estimatedCost: number;
  totalActivities: number;
  totalDuration: number;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Food & Wine": Utensils,
  Cultural: Palette,
  Adventure: Mountain,
  Nature: TreePine,
  "Water Sports": Waves,
  Wellness: Heart,
  Photography: Camera,
  Nightlife: Moon,
};

const TIME_COLORS: Record<string, string> = {
  morning: "from-amber-500/20 to-amber-500/5 border-amber-500/20",
  afternoon: "from-sky-500/20 to-sky-500/5 border-sky-500/20",
  evening: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/20",
};

const TIME_LABELS: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── Component ──────────────────────────────

export function TripDetailClient({ trip }: { trip: TripData }) {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="relative h-[35vh] min-h-[280px] overflow-hidden">
        <Image
          src={trip.destination.coverImage}
          alt={trip.destination.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-[var(--background)]/20" />

        <div className="section-container relative z-10 flex h-full flex-col justify-between pb-10 pt-28">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Link
              href="/dashboard/tourist"
              className="inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-accent/30 bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                {trip.status}
              </span>
              <span className="text-xs text-white/40">
                {trip.destination.name}, {trip.destination.country}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
              {trip.name}
            </h1>
            {trip.summary && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
                {trip.summary}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="section-container">
        {/* Stats bar */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="-mt-6 mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            {
              label: "Duration",
              value: `${trip.days} day${trip.days > 1 ? "s" : ""}`,
              icon: CalendarDays,
              sub: `${new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} → ${new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
            },
            {
              label: "Activities",
              value: trip.totalActivities.toString(),
              icon: Compass,
            },
            {
              label: "Est. Budget",
              value: `€${trip.estimatedCost}`,
              icon: Wallet,
              sub: "per person",
            },
            {
              label: "Total Time",
              value: formatDuration(trip.totalDuration),
              icon: Clock,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-card p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent/10 p-2">
                    <Icon className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-white/30">{stat.label}</p>
                    <p className="font-display text-base font-bold text-white">
                      {stat.value}
                    </p>
                    {"sub" in stat && stat.sub && (
                      <p className="text-[9px] text-white/20">{stat.sub}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Day-by-day itinerary */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {trip.itinerary.map((day) => (
              <motion.div key={day.dayNumber} variants={fadeInUp}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent-light/10">
                    <span className="font-display text-sm font-bold text-accent">
                      {day.dayNumber}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      Day {day.dayNumber}
                    </h3>
                    <p className="text-xs text-white/30">
                      {day.activities.length === 0
                        ? "Free day"
                        : `${day.activities.length} activit${day.activities.length === 1 ? "y" : "ies"} · €${day.activities.reduce((s, a) => s + a.price, 0)} est.`}
                    </p>
                  </div>
                </div>

                {day.activities.length === 0 ? (
                  <div className="ml-5 border-l-2 border-white/[0.06] pl-6">
                    <div className="rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01] p-6 text-center">
                      <p className="text-xs text-white/20">
                        Free day — explore on your own!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 border-l-2 border-white/[0.06] pl-6 ml-5">
                    {day.activities.map((act, ai) => {
                      const CatIcon = CATEGORY_ICONS[act.category] || Compass;
                      const imgs: string[] = JSON.parse(act.images);
                      const timeOfDay = act.timeOfDay || "morning";
                      const timeColor = TIME_COLORS[timeOfDay] || TIME_COLORS.morning;

                      return (
                        <div key={`${day.dayNumber}-${ai}`} className="relative">
                          <div className="absolute -left-[31px] top-4 h-3 w-3 rounded-full border-2 border-accent/50 bg-[var(--background)]" />

                          <div className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all hover:border-white/[0.12]">
                            <div className="flex flex-col sm:flex-row">
                              <div className="relative h-28 w-full shrink-0 sm:h-auto sm:w-32">
                                <Image
                                  src={imgs[0]}
                                  alt={act.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 640px) 100vw, 128px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--background)]/80 hidden sm:block" />
                              </div>
                              <div className="flex-1 p-4">
                                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                  <span className={`flex items-center gap-1 rounded-full border bg-gradient-to-r px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/60 ${timeColor}`}>
                                    {TIME_LABELS[timeOfDay] || timeOfDay}
                                    {act.startTime && ` · ${act.startTime}`}
                                  </span>
                                  <span className="flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[9px] font-medium text-white/40">
                                    <CatIcon className="h-2.5 w-2.5" />
                                    {act.category}
                                  </span>
                                </div>
                                <p className="font-display text-sm font-bold text-white">
                                  {act.title}
                                </p>
                                <div className="mt-2 flex items-center gap-3 text-[10px] text-white/30">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDuration(act.duration)}
                                  </span>
                                  {act.rating > 0 && (
                                    <span className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                      {act.rating.toFixed(1)}
                                    </span>
                                  )}
                                  <span className="ml-auto flex items-center gap-2">
                                    <span className="font-display text-sm font-bold text-white">
                                      {act.currency}{act.price}
                                    </span>
                                    <Link
                                      href={`/activities/${act.slug}`}
                                      className="flex items-center gap-1 rounded-lg border border-white/[0.08] px-2 py-1 text-[10px] text-white/40 transition-all hover:border-accent/30 hover:text-accent"
                                    >
                                      <ExternalLink className="h-2.5 w-2.5" />
                                      Book
                                    </Link>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-5">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="sticky top-28 space-y-5"
            >
              {/* Destination card */}
              <Link
                href={`/destinations/${trip.destination.slug}`}
                className="glass-card-hover flex items-center gap-3 p-4"
              >
                <MapPin className="h-5 w-5 shrink-0 text-primary-light" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {trip.destination.name}
                  </p>
                  <p className="text-xs text-white/30">
                    View all activities →
                  </p>
                </div>
              </Link>

              {/* Trip style tags */}
              {Object.keys(trip.preferences).length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="mb-3 font-display text-sm font-bold text-white">
                    Trip Style
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(trip.preferences).map(([key, val]) => {
                      const label = Array.isArray(val)
                        ? (val as string[]).join(", ")
                        : String(val);
                      return (
                        <span
                          key={key}
                          className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/40"
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CTA to Trip Builder */}
              <Link
                href="/dashboard/trip-builder"
                className="glass-card-hover flex items-center gap-3 p-5"
              >
                <div className="rounded-lg bg-accent/10 p-2">
                  <Compass className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Build Another Trip
                  </p>
                  <p className="text-[10px] text-white/30">
                    Create a new personalized itinerary
                  </p>
                </div>
              </Link>

              {/* Interactive Map */}
              <div className="glass-card p-5">
                <div className="mb-3 flex items-center gap-2 text-xs text-white/40">
                  <MapIcon className="h-4 w-4 text-accent" />
                  <span className="font-medium">Interactive Map</span>
                </div>
                <VoyagioMap
                  center={[
                    trip.destination.latitude,
                    trip.destination.longitude,
                  ]}
                  zoom={12}
                  height="h-[220px]"
                  showDayColors
                  markers={trip.itinerary.flatMap((day) =>
                    day.activities
                      .filter((a) => a.latitude && a.longitude)
                      .map((a) => ({
                        lat: a.latitude,
                        lng: a.longitude,
                        title: a.title,
                        category: a.category,
                        price: a.price,
                        currency: a.currency,
                        slug: a.slug,
                        dayNumber: day.dayNumber,
                      }))
                  )}
                />
              </div>

              {/* Weather Forecast */}
              <WeatherWidget
                lat={trip.destination.latitude}
                lng={trip.destination.longitude}
                compact
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
