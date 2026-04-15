"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MapPin,
  CalendarDays,
  Wallet,
  Compass,
  Users,
  Gauge,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Star,
  Clock,
  CheckCircle2,
  Save,
  RotateCcw,
  ArrowRight,
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
} from "lucide-react";
import { fadeInUp, fadeIn, staggerContainer } from "@/lib/motion";

// ─── Types ──────────────────────────────────────

interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  coverImage: string;
  activityCount: number;
}

interface ItineraryActivity {
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
  timeOfDay: string;
  startTime: string;
  description: string;
}

interface ItineraryDay {
  dayNumber: number;
  activities: ItineraryActivity[];
}

interface GeneratedTrip {
  tripName: string;
  summary: string;
  destination: {
    id: string;
    name: string;
    slug: string;
    country: string;
    coverImage: string;
  };
  preferences: Record<string, unknown>;
  days: number;
  itinerary: ItineraryDay[];
  estimatedCost: number;
  totalActivities: number;
  totalDuration: number;
}

// ─── Constants ──────────────────────────────────

const TRAVEL_STYLES = [
  { value: "relaxed", label: "Relaxed", icon: Heart, desc: "Easy-going, no rush" },
  { value: "cultural", label: "Cultural", icon: Palette, desc: "History & heritage" },
  { value: "adventure", label: "Adventure", icon: Mountain, desc: "Thrills & exploration" },
  { value: "foodie", label: "Foodie", icon: Utensils, desc: "Culinary focus" },
  { value: "luxury", label: "Luxury", icon: Star, desc: "Premium experiences" },
  { value: "mixed", label: "Mixed", icon: Compass, desc: "Best of everything" },
];

const INTERESTS = [
  { value: "food", label: "Food & Dining", icon: Utensils },
  { value: "history", label: "History & Culture", icon: Palette },
  { value: "beaches", label: "Beaches & Sea", icon: Waves },
  { value: "nature", label: "Nature & Hiking", icon: TreePine },
  { value: "nightlife", label: "Nightlife", icon: Moon },
  { value: "wellness", label: "Wellness & Spa", icon: Heart },
  { value: "adventure", label: "Adventure Sports", icon: Mountain },
  { value: "photography", label: "Photography", icon: Camera },
];

const PACE_OPTIONS = [
  { value: "light", label: "Light", desc: "2 activities/day — plenty of free time", color: "from-green-500/20 to-green-500/5" },
  { value: "balanced", label: "Balanced", desc: "3 activities/day — best of both worlds", color: "from-accent/20 to-accent/5" },
  { value: "packed", label: "Packed", desc: "4 activities/day — see it all!", color: "from-purple-500/20 to-purple-500/5" },
];

const GROUP_TYPES = [
  { value: "solo", label: "Solo" },
  { value: "couple", label: "Couple" },
  { value: "friends", label: "Friends" },
  { value: "family", label: "Family" },
];

const BUDGET_OPTIONS = [
  { value: "budget", label: "Budget", desc: "€0–40 per activity", color: "text-green-400" },
  { value: "moderate", label: "Moderate", desc: "€20–80 per activity", color: "text-blue-400" },
  { value: "premium", label: "Premium", desc: "€50–150 per activity", color: "text-purple-400" },
  { value: "luxury", label: "Luxury", desc: "€80+ per activity", color: "text-amber-400" },
];

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

// ─── Component ──────────────────────────────────

interface Props {
  destinations: Destination[];
}

export function TripBuilderClient({ destinations }: Props) {
  const router = useRouter();

  // Wizard state
  const [step, setStep] = useState(0);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [days, setDays] = useState(3);
  const [budgetRange, setBudgetRange] = useState("moderate");
  const [travelStyle, setTravelStyle] = useState("mixed");
  const [interests, setInterests] = useState<string[]>([]);
  const [pace, setPace] = useState("balanced");
  const [groupType, setGroupType] = useState("couple");

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [generatedTrip, setGeneratedTrip] = useState<GeneratedTrip | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedTripId, setSavedTripId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const STEPS = [
    { label: "Destination", icon: MapPin },
    { label: "Duration", icon: CalendarDays },
    { label: "Style", icon: Compass },
    { label: "Interests", icon: Sparkles },
    { label: "Preferences", icon: Gauge },
  ];

  const canProceed = () => {
    switch (step) {
      case 0: return !!selectedDest;
      case 1: return days >= 1 && days <= 14;
      case 2: return !!travelStyle;
      case 3: return interests.length > 0;
      case 4: return !!pace && !!budgetRange;
      default: return true;
    }
  };

  function toggleInterest(val: string) {
    setInterests((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  }

  async function handleGenerate() {
    if (!selectedDest) return;
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/trips/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationSlug: selectedDest.slug,
          days,
          budgetRange,
          travelStyle,
          interests,
          pace,
          groupType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate trip");
        setGenerating(false);
        return;
      }

      setGeneratedTrip(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!generatedTrip) return;
    setSaving(true);

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripName: generatedTrip.tripName,
          summary: generatedTrip.summary,
          destinationId: generatedTrip.destination.id,
          days: generatedTrip.days,
          preferences: generatedTrip.preferences,
          itinerary: generatedTrip.itinerary,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSaved(true);
        setSavedTripId(data.trip.id);
      }
    } catch {
      // silent fail
    } finally {
      setSaving(false);
    }
  }

  function handleRegenerate() {
    setGeneratedTrip(null);
    setSaved(false);
    setSavedTripId(null);
    handleGenerate();
  }

  function handleStartOver() {
    setStep(0);
    setGeneratedTrip(null);
    setSaved(false);
    setSavedTripId(null);
    setError(null);
  }

  // ─── Itinerary view ─────────────────────────
  if (generatedTrip) {
    return (
      <ItineraryView
        trip={generatedTrip}
        saving={saving}
        saved={saved}
        savedTripId={savedTripId}
        onSave={handleSave}
        onRegenerate={handleRegenerate}
        onStartOver={handleStartOver}
      />
    );
  }

  // ─── Generating animation ───────────────────
  if (generating) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mx-auto mb-6 h-20 w-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-accent/20 border-t-accent"
            />
            <div className="absolute inset-3 flex items-center justify-center rounded-full bg-accent/10">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            Crafting Your <span className="gradient-text">Perfect Trip</span>
          </h2>
          <p className="mt-2 text-sm text-white/40">
            Analyzing {selectedDest?.activityCount} experiences in{" "}
            {selectedDest?.name}...
          </p>
        </motion.div>
      </div>
    );
  }

  // ─── Wizard ────────────────────────────────
  return (
    <div className="min-h-screen pb-20 pt-24">
      <div className="section-container max-w-4xl">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-10 text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent-light/10">
            <Sparkles className="h-7 w-7 text-accent" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
            Smart <span className="gradient-text">Trip Builder</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Tell us your travel preferences and we&apos;ll create a personalized
            itinerary
          </p>
        </motion.div>

        {/* Progress steps */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <div className="flex items-center justify-center gap-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone = i < step;
              return (
                <div key={s.label} className="flex items-center gap-2">
                  {i > 0 && (
                    <div
                      className={`h-px w-6 transition-colors sm:w-10 ${
                        isDone ? "bg-accent" : "bg-white/[0.08]"
                      }`}
                    />
                  )}
                  <button
                    onClick={() => isDone && setStep(i)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? "border-accent/40 bg-accent/15 text-accent"
                        : isDone
                          ? "border-accent/20 bg-accent/5 text-accent/60 hover:bg-accent/10 cursor-pointer"
                          : "border-white/[0.06] bg-white/[0.02] text-white/25"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Step 0: Destination */}
            {step === 0 && (
              <div>
                <h2 className="mb-6 text-center font-display text-xl font-bold text-white">
                  Where do you want to go?
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {destinations.map((dest) => {
                    const isSelected = selectedDest?.slug === dest.slug;
                    return (
                      <button
                        key={dest.slug}
                        onClick={() => setSelectedDest(dest)}
                        className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                          isSelected
                            ? "border-accent/50 ring-2 ring-accent/25 shadow-lg shadow-accent/10"
                            : "border-white/[0.08] hover:border-white/[0.15]"
                        }`}
                      >
                        <div className="relative h-32 w-full">
                          <Image
                            src={dest.coverImage}
                            alt={dest.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/40 to-transparent" />
                          {isSelected && (
                            <div className="absolute right-3 top-3 rounded-full bg-accent p-1">
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="font-display text-base font-bold text-white">
                            {dest.name}
                          </p>
                          <p className="text-xs text-white/40">
                            {dest.country} · {dest.activityCount} activities
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 1: Duration */}
            {step === 1 && (
              <div className="mx-auto max-w-md text-center">
                <h2 className="mb-6 font-display text-xl font-bold text-white">
                  How many days?
                </h2>
                <div className="glass-card p-8">
                  <div className="mb-6 flex items-center justify-center gap-6">
                    <button
                      onClick={() => setDays((d) => Math.max(1, d - 1))}
                      className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-white transition-all hover:bg-white/[0.08] active:scale-95"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <span className="font-display text-6xl font-bold text-white">
                        {days}
                      </span>
                      <p className="mt-1 text-sm text-white/40">
                        day{days !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => setDays((d) => Math.min(14, d + 1))}
                      className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-white transition-all hover:bg-white/[0.08] active:scale-95"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 5, 7, 10].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDays(d)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                          days === d
                            ? "bg-accent/20 text-accent"
                            : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Travel Style */}
            {step === 2 && (
              <div className="mx-auto max-w-lg">
                <h2 className="mb-6 text-center font-display text-xl font-bold text-white">
                  What&apos;s your travel style?
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {TRAVEL_STYLES.map((style) => {
                    const Icon = style.icon;
                    const isSelected = travelStyle === style.value;
                    return (
                      <button
                        key={style.value}
                        onClick={() => setTravelStyle(style.value)}
                        className={`group rounded-2xl border p-5 text-left transition-all duration-300 ${
                          isSelected
                            ? "border-accent/50 bg-accent/10 shadow-lg shadow-accent/5"
                            : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                        }`}
                      >
                        <Icon
                          className={`mb-2 h-5 w-5 ${isSelected ? "text-accent" : "text-white/30"}`}
                        />
                        <p
                          className={`text-sm font-semibold ${isSelected ? "text-white" : "text-white/70"}`}
                        >
                          {style.label}
                        </p>
                        <p className="mt-0.5 text-[10px] text-white/30">
                          {style.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Interests */}
            {step === 3 && (
              <div className="mx-auto max-w-lg">
                <h2 className="mb-2 text-center font-display text-xl font-bold text-white">
                  What interests you most?
                </h2>
                <p className="mb-6 text-center text-xs text-white/30">
                  Select at least one — the more you pick, the more diverse your
                  itinerary
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {INTERESTS.map((interest) => {
                    const Icon = interest.icon;
                    const isSelected = interests.includes(interest.value);
                    return (
                      <button
                        key={interest.value}
                        onClick={() => toggleInterest(interest.value)}
                        className={`rounded-xl border p-4 text-center transition-all duration-300 ${
                          isSelected
                            ? "border-accent/50 bg-accent/10"
                            : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                        }`}
                      >
                        <Icon
                          className={`mx-auto mb-1.5 h-5 w-5 ${isSelected ? "text-accent" : "text-white/25"}`}
                        />
                        <p
                          className={`text-[11px] font-medium ${isSelected ? "text-white" : "text-white/50"}`}
                        >
                          {interest.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Pace + Budget + Group */}
            {step === 4 && (
              <div className="mx-auto max-w-lg space-y-8">
                {/* Pace */}
                <div>
                  <h2 className="mb-4 text-center font-display text-xl font-bold text-white">
                    Trip pace & budget
                  </h2>
                  <div className="space-y-2">
                    {PACE_OPTIONS.map((p) => {
                      const isSelected = pace === p.value;
                      return (
                        <button
                          key={p.value}
                          onClick={() => setPace(p.value)}
                          className={`flex w-full items-center gap-4 rounded-xl border bg-gradient-to-r p-4 text-left transition-all ${
                            isSelected
                              ? `border-accent/40 ${p.color}`
                              : "border-white/[0.06] from-transparent to-transparent hover:border-white/[0.12]"
                          }`}
                        >
                          <Gauge
                            className={`h-5 w-5 shrink-0 ${isSelected ? "text-accent" : "text-white/25"}`}
                          />
                          <div>
                            <p
                              className={`text-sm font-semibold ${isSelected ? "text-white" : "text-white/60"}`}
                            >
                              {p.label}
                            </p>
                            <p className="text-[10px] text-white/30">
                              {p.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <Wallet className="h-4 w-4 text-accent" />
                    Budget per activity
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {BUDGET_OPTIONS.map((b) => {
                      const isSelected = budgetRange === b.value;
                      return (
                        <button
                          key={b.value}
                          onClick={() => setBudgetRange(b.value)}
                          className={`rounded-xl border p-3 text-center transition-all ${
                            isSelected
                              ? "border-accent/40 bg-accent/10"
                              : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                          }`}
                        >
                          <p
                            className={`text-xs font-bold ${isSelected ? b.color : "text-white/50"}`}
                          >
                            {b.label}
                          </p>
                          <p className="mt-0.5 text-[9px] text-white/25">
                            {b.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Group type */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <Users className="h-4 w-4 text-accent" />
                    Traveling as
                  </h3>
                  <div className="flex gap-2">
                    {GROUP_TYPES.map((g) => {
                      const isSelected = groupType === g.value;
                      return (
                        <button
                          key={g.value}
                          onClick={() => setGroupType(g.value)}
                          className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                            isSelected
                              ? "border-accent/40 bg-accent/15 text-accent"
                              : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/[0.12]"
                          }`}
                        >
                          {g.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div className="mx-auto mt-6 max-w-md rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mx-auto mt-10 flex max-w-md items-center justify-between">
          <button
            onClick={() => setStep((s) => s - 1)}
            className={`btn-secondary !px-5 !py-2.5 !text-xs ${step === 0 ? "invisible" : ""}`}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="btn-primary !px-8 !py-2.5 !text-xs disabled:opacity-40"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={!canProceed()}
              className="btn-primary !px-8 !py-2.5 !text-xs disabled:opacity-40"
            >
              <Sparkles className="h-4 w-4" />
              Generate Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  ITINERARY VIEW — The premium output screen
// ═══════════════════════════════════════════════

function ItineraryView({
  trip,
  saving,
  saved,
  savedTripId,
  onSave,
  onRegenerate,
  onStartOver,
}: {
  trip: GeneratedTrip;
  saving: boolean;
  saved: boolean;
  savedTripId: string | null;
  onSave: () => void;
  onRegenerate: () => void;
  onStartOver: () => void;
}) {
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

        <div className="section-container relative z-10 flex h-full flex-col justify-end pb-10 pt-28">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-accent/30 bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                Smart Trip
              </span>
              <span className="text-xs text-white/40">
                {trip.destination.name}, {trip.destination.country}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
              {trip.tripName}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
              {trip.summary}
            </p>
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
            },
            {
              label: "Activities",
              value: trip.totalActivities.toString(),
              icon: Compass,
            },
            {
              label: "Est. Cost",
              value: `€${trip.estimatedCost}`,
              icon: Wallet,
            },
            {
              label: "Total Time",
              value: formatDuration(trip.totalDuration),
              icon: Clock,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="glass-card flex items-center gap-3 p-4"
              >
                <div className="rounded-lg bg-accent/10 p-2">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-white/30">{stat.label}</p>
                  <p className="font-display text-base font-bold text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Day-by-day itinerary */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {trip.itinerary.map((day) => (
              <motion.div key={day.dayNumber} variants={fadeInUp}>
                {/* Day header */}
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
                      {day.activities.length} activit
                      {day.activities.length === 1 ? "y" : "ies"} · €
                      {day.activities.reduce((s, a) => s + a.price, 0)} est.
                    </p>
                  </div>
                </div>

                {/* Activities timeline */}
                <div className="space-y-3 border-l-2 border-white/[0.06] pl-6 ml-5">
                  {day.activities.map((act, ai) => {
                    const CatIcon =
                      CATEGORY_ICONS[act.category] || Compass;
                    const imgs: string[] = JSON.parse(act.images);
                    const timeColor =
                      TIME_COLORS[act.timeOfDay] || TIME_COLORS.morning;

                    return (
                      <div
                        key={`${day.dayNumber}-${ai}`}
                        className="relative"
                      >
                        {/* Timeline dot */}
                        <div className="absolute -left-[31px] top-4 h-3 w-3 rounded-full border-2 border-accent/50 bg-[var(--background)]" />

                        <div className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all hover:border-white/[0.12]">
                          <div className="flex flex-col sm:flex-row">
                            {/* Image */}
                            <div className="relative h-32 w-full shrink-0 sm:h-auto sm:w-36">
                              <Image
                                src={imgs[0]}
                                alt={act.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, 144px"
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--background)]/80 hidden sm:block" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-4">
                              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                <span
                                  className={`flex items-center gap-1 rounded-full border bg-gradient-to-r px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/60 ${timeColor}`}
                                >
                                  {TIME_LABELS[act.timeOfDay]}
                                  {" · "}
                                  {act.startTime}
                                </span>
                                <span className="flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[9px] font-medium text-white/40">
                                  <CatIcon className="h-2.5 w-2.5" />
                                  {act.category}
                                </span>
                              </div>

                              <Link
                                href={`/activities/${act.slug}`}
                                className="font-display text-sm font-bold text-white transition-colors hover:text-accent"
                              >
                                {act.title}
                              </Link>

                              <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-white/35">
                                {act.description}
                              </p>

                              <div className="mt-2 flex items-center gap-3 text-[10px] text-white/30">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDuration(act.duration)}
                                </div>
                                {act.rating > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    {act.rating.toFixed(1)}
                                  </div>
                                )}
                                <span className="ml-auto font-display text-sm font-bold text-white">
                                  {act.currency}
                                  {act.price}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
              {/* Actions card */}
              <div className="glass-card p-5 space-y-3">
                <h3 className="font-display text-sm font-bold text-white">
                  Trip Actions
                </h3>

                {saved ? (
                  <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-center">
                    <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-green-400" />
                    <p className="text-sm font-medium text-green-400">
                      Trip Saved!
                    </p>
                    {savedTripId && (
                      <Link
                        href={`/dashboard/trips/${savedTripId}`}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-accent hover:text-accent-light"
                      >
                        View Trip
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={onSave}
                    disabled={saving}
                    className="btn-primary w-full !rounded-xl !py-3 !text-xs"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Trip
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={onRegenerate}
                  className="btn-secondary w-full !rounded-xl !py-3 !text-xs"
                >
                  <RotateCcw className="h-4 w-4" />
                  Regenerate
                </button>

                <button
                  onClick={onStartOver}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 text-xs font-medium text-white/40 transition-all hover:border-white/[0.12] hover:text-white/60"
                >
                  Start Over
                </button>
              </div>

              {/* Trip preferences summary */}
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

              {/* Future: Map teaser */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 text-xs text-white/20">
                  <MapIcon className="h-4 w-4" />
                  <span>Map visualization</span>
                </div>
                <div className="mt-3 flex h-28 items-center justify-center rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01]">
                  <div className="text-center">
                    <MapIcon className="mx-auto mb-1 h-6 w-6 text-white/10" />
                    <p className="text-[10px] text-white/15">
                      Interactive map coming soon
                    </p>
                  </div>
                </div>
              </div>

              {/* Future: Weather teaser */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 text-xs text-white/20">
                  <CloudSun className="h-4 w-4" />
                  <span>Weather insights</span>
                </div>
                <div className="mt-3 flex h-20 items-center justify-center rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01]">
                  <p className="text-[10px] text-white/15">
                    Weather-aware planning coming soon
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
