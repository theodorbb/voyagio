"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Mountain,
  Palette,
  Utensils,
  Waves,
  Camera,
  Heart,
  Sparkles,
  Sun,
  Moon,
  Users,
  User,
  DollarSign,
  Clock,
  Zap,
  Coffee,
} from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ── Step definitions ──

const INTERESTS = [
  { id: "adventure", label: "Adventure", icon: Mountain, color: "#F4845F" },
  { id: "cultural", label: "Cultural", icon: Palette, color: "#5FA8D3" },
  { id: "food-wine", label: "Food & Wine", icon: Utensils, color: "#F7B267" },
  { id: "nature", label: "Nature", icon: Compass, color: "#22C55E" },
  { id: "water-sports", label: "Water Sports", icon: Waves, color: "#3B82F6" },
  { id: "photography", label: "Photography", icon: Camera, color: "#A78BFA" },
  { id: "wellness", label: "Wellness", icon: Heart, color: "#EC4899" },
  { id: "nightlife", label: "Nightlife", icon: Moon, color: "#F59E0B" },
];

const TRAVEL_STYLES = [
  { id: "solo", label: "Solo Explorer", desc: "Freedom to go anywhere", icon: User },
  { id: "couple", label: "Couple", desc: "Romantic getaways", icon: Heart },
  { id: "family", label: "Family", desc: "Adventures for all ages", icon: Users },
  { id: "group", label: "Group / Friends", desc: "Social experiences", icon: Users },
];

const BUDGET_RANGES = [
  { id: "budget", label: "Budget", desc: "€0 – €50/day", icon: DollarSign },
  { id: "medium", label: "Mid-Range", desc: "€50 – €150/day", icon: DollarSign },
  { id: "high", label: "Premium", desc: "€150 – €300/day", icon: DollarSign },
  { id: "luxury", label: "Luxury", desc: "€300+/day", icon: Sparkles },
];

const PACE_OPTIONS = [
  { id: "relaxed", label: "Relaxed", desc: "1–2 activities per day", icon: Coffee },
  { id: "moderate", label: "Moderate", desc: "2–3 activities per day", icon: Sun },
  { id: "active", label: "Active", desc: "4+ activities per day", icon: Zap },
];

const TRIP_DURATION = [
  { id: "weekend", label: "Weekend", desc: "2–3 days" },
  { id: "short", label: "Short Trip", desc: "4–6 days" },
  { id: "week", label: "One Week", desc: "7 days" },
  { id: "extended", label: "Extended", desc: "10+ days" },
];

const STEPS = [
  { title: "What excites you?", subtitle: "Select your top interests (pick at least 2)" },
  { title: "How do you travel?", subtitle: "Choose your travel style" },
  { title: "What's your budget?", subtitle: "Your typical daily travel budget" },
  { title: "What's your pace?", subtitle: "How packed do you like your days?" },
  { title: "Ideal trip length?", subtitle: "Your preferred trip duration" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Preference state
  const [interests, setInterests] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [travelPace, setTravelPace] = useState("");
  const [tripDuration, setTripDuration] = useState("");

  function toggleInterest(id: string) {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function canProceed(): boolean {
    switch (step) {
      case 0: return interests.length >= 2;
      case 1: return !!travelStyle;
      case 2: return !!budgetRange;
      case 3: return !!travelPace;
      case 4: return !!tripDuration;
      default: return false;
    }
  }

  async function handleFinish() {
    setLoading(true);
    try {
      await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: {
            interests,
            travelStyle,
            budgetRange,
            travelPace,
            tripDuration,
          },
        }),
      });
      router.push("/dashboard/tourist");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-24">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-accent/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
        <div className="dot-pattern absolute inset-0 opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-white/50">
                Step {step + 1} of {STEPS.length}
              </span>
            </div>
            <button
              onClick={() => {
                router.push("/dashboard/tourist");
                router.refresh();
              }}
              className="text-xs text-white/30 transition-colors hover:text-white/50"
            >
              Skip for now
            </button>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className="glass-card p-8"
          >
            <div className="mb-6 text-center">
              <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
                {STEPS[step].title}
              </h1>
              <p className="mt-2 text-sm text-white/50">{STEPS[step].subtitle}</p>
            </div>

            {/* Step 0: Interests */}
            {step === 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {INTERESTS.map((item) => {
                  const selected = interests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleInterest(item.id)}
                      className={cn(
                        "group flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200",
                        selected
                          ? "border-accent/40 bg-accent/10"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-lg p-2 transition-all",
                          selected ? "bg-accent/20" : "bg-white/[0.04]"
                        )}
                      >
                        <item.icon
                          className="h-5 w-5"
                          style={{ color: selected ? item.color : "rgba(255,255,255,0.3)" }}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium transition-colors",
                          selected ? "text-white" : "text-white/50"
                        )}
                      >
                        {item.label}
                      </span>
                      {selected && (
                        <Check className="h-3 w-3 text-accent" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 1: Travel Style */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {TRAVEL_STYLES.map((item) => {
                  const selected = travelStyle === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTravelStyle(item.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-5 transition-all duration-200",
                        selected
                          ? "border-accent/40 bg-accent/10"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]"
                      )}
                    >
                      <item.icon className={cn("h-6 w-6", selected ? "text-accent" : "text-white/30")} />
                      <span className={cn("text-sm font-medium", selected ? "text-white" : "text-white/60")}>
                        {item.label}
                      </span>
                      <span className="text-xs text-white/30">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 2: Budget */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-3">
                {BUDGET_RANGES.map((item) => {
                  const selected = budgetRange === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setBudgetRange(item.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-5 transition-all duration-200",
                        selected
                          ? "border-accent/40 bg-accent/10"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]"
                      )}
                    >
                      <item.icon className={cn("h-6 w-6", selected ? "text-accent" : "text-white/30")} />
                      <span className={cn("text-sm font-medium", selected ? "text-white" : "text-white/60")}>
                        {item.label}
                      </span>
                      <span className="text-xs text-white/30">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 3: Pace */}
            {step === 3 && (
              <div className="grid grid-cols-3 gap-3">
                {PACE_OPTIONS.map((item) => {
                  const selected = travelPace === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTravelPace(item.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-5 transition-all duration-200",
                        selected
                          ? "border-accent/40 bg-accent/10"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]"
                      )}
                    >
                      <item.icon className={cn("h-6 w-6", selected ? "text-accent" : "text-white/30")} />
                      <span className={cn("text-sm font-medium", selected ? "text-white" : "text-white/60")}>
                        {item.label}
                      </span>
                      <span className="text-xs text-white/30">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 4: Trip Duration */}
            {step === 4 && (
              <div className="grid grid-cols-2 gap-3">
                {TRIP_DURATION.map((item) => {
                  const selected = tripDuration === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTripDuration(item.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-5 transition-all duration-200",
                        selected
                          ? "border-accent/40 bg-accent/10"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]"
                      )}
                    >
                      <Clock className={cn("h-6 w-6", selected ? "text-accent" : "text-white/30")} />
                      <span className={cn("text-sm font-medium", selected ? "text-white" : "text-white/60")}>
                        {item.label}
                      </span>
                      <span className="text-xs text-white/30">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setStep(step - 1)}
                disabled={step === 0}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                  step === 0
                    ? "invisible"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className={cn(
                  "btn-primary !rounded-xl !py-2.5 !px-6 text-sm",
                  (!canProceed() || loading) && "pointer-events-none opacity-40"
                )}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : step === STEPS.length - 1 ? (
                  <>
                    Finish
                    <Check className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
