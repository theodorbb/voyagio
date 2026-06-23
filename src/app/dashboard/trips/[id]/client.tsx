"use client";

import { useState, useCallback } from "react";
import { SafeImage } from "@/components/shared/safe-image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Compass,
  Wallet,
  MapPin,
  Map as MapIcon,
  Pencil,
  Check,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { fadeInUp, fadeIn, staggerContainer } from "@/lib/motion";
import { VoyagioMap } from "@/components/maps/voyagio-map";
import { WeatherWidget } from "@/components/weather/weather-widget";
import {
  useItineraryEditor,
  paceTargetFor,
  formatDuration,
  ItineraryBoard,
  ActivityPickerDialog,
  EditorToast,
  type AvailableActivity,
  type EditableDay,
} from "@/components/trips/itinerary-editor";
import { TripRefiner } from "@/components/trips/trip-refiner";

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
  itinerary: EditableDay[];
  estimatedCost: number;
  totalActivities: number;
  totalDuration: number;
}

export function TripDetailClient({
  trip,
  availableActivities,
}: {
  trip: TripData;
  availableActivities: AvailableActivity[];
}) {
  const router = useRouter();
  const editor = useItineraryEditor({
    initialDays: trip.itinerary,
    availableActivities,
    paceTarget: paceTargetFor(trip.preferences?.pace),
  });
  const { working, editing, setEditing, dirty, totals, showToast } = editor;

  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const save = useCallback(async () => {
    setSaveState("saving");
    try {
      const res = await fetch(`/api/trips/${trip.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itinerary: editor.getSavePayload() }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message =
          data && typeof data.error === "string"
            ? data.error
            : "We couldn't save your itinerary. Please try again.";
        throw new Error(message);
      }

      setSaveState("saved");
      editor.setDirty(false);
      setEditing(false);
      showToast("Your itinerary has been saved.", "success");
      router.refresh();
      window.setTimeout(() => setSaveState("idle"), 2000);
    } catch (err) {

      setSaveState("error");
      const message =
        err instanceof Error && err.message
          ? err.message
          : "We couldn't save your itinerary. Please try again.";
      showToast(message, "error");
    }
  }, [trip.id, editor, router, setEditing, showToast]);

  const cancelEdit = useCallback(() => {
    editor.reset(trip.itinerary);
    setSaveState("idle");
    setEditing(false);
  }, [editor, trip.itinerary, setEditing]);

  return (
    <div className="min-h-screen pb-28">

      <section className="relative h-[38vh] min-h-[300px] overflow-hidden">
        <SafeImage
          src={trip.destination.coverImage}
          alt={trip.destination.name}
          fill
          priority
          className="scale-105 object-cover blur-[2px]"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-[var(--background)]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/70 to-[var(--background)]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)]/70 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.65)]" />

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
            <h1 className="font-display text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
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

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="-mt-6 mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4"
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
              value: totals.count.toString(),
              icon: Compass,
            },
            {
              label: "Est. Budget",
              value: `€${totals.cost}`,
              icon: Wallet,
              sub: "per person",
            },
            {
              label: "Total Time",
              value: formatDuration(totals.duration),
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

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3"
        >
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Pencil className="h-4 w-4 text-accent" />
            <span className="font-medium">
              {editing
                ? "Editing your itinerary. Drag, move or swap activities to fit your trip."
                : "Fine-tune this itinerary to match how you like to travel."}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-accent/90"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit itinerary
              </button>
            ) : (
              <>
                {saveState === "error" && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-red-300">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Save failed
                  </span>
                )}
                {saveState === "saved" && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-300">
                    <Check className="h-3.5 w-3.5" />
                    Saved
                  </span>
                )}
                {dirty && saveState === "idle" && (
                  <span className="text-[11px] font-medium text-white/30">
                    Unsaved changes
                  </span>
                )}
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs font-medium text-white/50 transition-all hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={!dirty || saveState === "saving"}
                  className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saveState === "saving" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : saveState === "error" ? (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  {saveState === "saving" ? "Saving..." : "Save changes"}
                </button>
              </>
            )}
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <TripRefiner
              editor={editor}
              lat={trip.destination.latitude}
              lng={trip.destination.longitude}
              destinationName={trip.destination.name}
            />
            <ItineraryBoard editor={editor} />
          </motion.div>

          <div className="space-y-5">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="sticky top-28 space-y-5"
            >

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
                  markers={working.flatMap((day) =>
                    day.activities
                      .filter((a) => a.latitude != null && a.longitude != null)
                      .map((a) => ({
                        lat: a.latitude as number,
                        lng: a.longitude as number,
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

              <WeatherWidget
                lat={trip.destination.latitude}
                lng={trip.destination.longitude}
                compact
              />
            </motion.div>
          </div>
        </div>
      </div>

      <ActivityPickerDialog editor={editor} />

      <EditorToast editor={editor} />
    </div>
  );
}

