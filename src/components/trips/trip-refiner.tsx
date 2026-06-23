"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  Loader2,
  Undo2,
  Check,
  Replace,
  Trash2,
  Plus,
  ArrowUpDown,
  Leaf,
  Palette,
  Heart,
  Wallet,
  CloudRain,
  Mountain,
  Route,
  RefreshCw,
  Info,
} from "lucide-react";
import type {
  ItineraryEditor,
  EditableDay,
} from "@/components/trips/itinerary-editor";
import {
  refine,
  GOALS,
  type GoalId,
  type RefinementScope,
  type RefineResult,
  type WeatherInfo,
} from "@/lib/trip-refiner";

const GOAL_ICONS: Record<GoalId, React.ElementType> = {
  relaxed: Leaf,
  cultural: Palette,
  romantic: Heart,
  cheaper: Wallet,
  weatherSafe: CloudRain,
  outdoor: Mountain,
  lessTravel: Route,
  regenerateDay: RefreshCw,
};

const CHANGE_ICONS = {
  replaced: Replace,
  removed: Trash2,
  added: Plus,
  reordered: ArrowUpDown,
} as const;

const REFINER_GOAL_IDS: GoalId[] = [
  "relaxed",
  "cultural",
  "weatherSafe",
  "cheaper",
  "regenerateDay",
];
const REFINER_GOALS = REFINER_GOAL_IDS.map(
  (id) => GOALS.find((g) => g.id === id)!
);

const POOR_WEATHER = /rain|storm|cloud/i;

export function TripRefiner({
  editor,
  lat,
  lng,
  destinationName,
}: {
  editor: ItineraryEditor;
  lat?: number;
  lng?: number;
  destinationName?: string;
}) {
  const { working, availableActivities, paceTarget, applyDays, setEditing, showToast } =
    editor;

  const [scopeDay, setScopeDay] = useState<"all" | number>("all");
  const [status, setStatus] = useState<"idle" | "thinking">("idle");
  const [result, setResult] = useState<RefineResult | null>(null);
  const [snapshot, setSnapshot] = useState<EditableDay[] | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);

  const dayNumbers = useMemo(
    () => working.map((d) => d.dayNumber),
    [working]
  );

  useEffect(() => {
    if (lat == null || lng == null) return;
    let active = true;
    fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active || !data?.current) return;
        const condition: string = data.current.condition ?? "";
        setWeather({ condition, poor: POOR_WEATHER.test(condition) });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [lat, lng]);

  const buildScope = (override?: RefinementScope): RefinementScope => {
    if (override) return override;
    return scopeDay === "all" ? { type: "all" } : { type: "day", day: scopeDay };
  };

  const run = (goal: GoalId, scope: RefinementScope) => {
    setStatus("thinking");

    window.setTimeout(() => {
      const snap = working.map((d) => ({
        ...d,
        activities: d.activities.map((a) => ({ ...a })),
      }));
      const res = refine({
        days: working,
        available: availableActivities,
        goal,
        scope,
        paceTarget,
        weather,
      });
      setStatus("idle");
      if (!res.changed) {
        setResult({
          ...res,
          summary:
            "This part of the trip already fits that style, so nothing needed to change. Try another refinement or a different day.",
        });
        setSnapshot(null);
        showToast(
          "This already matches that style. Try another refinement.",
          "warning"
        );
        return;
      }
      setSnapshot(snap);
      setResult(res);
      applyDays(res.days);
      setEditing(true);
      showToast("Itinerary refined. Review the changes below.", "success");
    }, 650);
  };

  const onChip = (goal: GoalId) => run(goal, buildScope());

  const onUndo = () => {
    if (!snapshot) return;
    applyDays(snapshot);
    setSnapshot(null);
    setResult(null);
    showToast("Refinement reverted.", "success");
  };

  const saved = result ? Math.max(0, result.costBefore - result.costAfter) : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.08] via-white/[0.02] to-primary/[0.06]">

      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15">
          <Wand2 className="h-5 w-5 text-accent" />
        </div>
        <div className="mr-auto">
          <h3 className="flex items-center gap-1.5 font-display text-base font-bold text-white">
            Smart Trip Refiner
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </h3>
          <p className="text-xs text-white/40">
            Refine this plan with one tap{destinationName ? ` — only real ${destinationName} experiences` : ""}.
          </p>
        </div>
        {weather?.poor && (
          <span className="flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[11px] font-medium text-sky-200">
            <CloudRain className="h-3.5 w-3.5" />
            {weather.condition} expected
          </span>
        )}
      </div>

      <div className="space-y-4 p-5">

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/30">
            Apply to
          </span>
          <button
            onClick={() => setScopeDay("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              scopeDay === "all"
                ? "bg-accent text-white"
                : "border border-white/[0.1] text-white/50 hover:text-white"
            }`}
          >
            Whole trip
          </button>
          {dayNumbers.map((n) => (
            <button
              key={n}
              onClick={() => setScopeDay(n)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                scopeDay === n
                  ? "bg-accent text-white"
                  : "border border-white/[0.1] text-white/50 hover:text-white"
              }`}
            >
              Day {n}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {REFINER_GOALS.map((g) => {
            const Icon = GOAL_ICONS[g.id];
            const disabled = status === "thinking";
            return (
              <button
                key={g.id}
                onClick={() => onChip(g.id)}
                disabled={disabled}
                title={g.hint}
                className="group flex flex-col items-start gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-left transition-all hover:border-accent/40 hover:bg-accent/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
                <span className="text-xs font-semibold text-white">
                  {g.label}
                </span>
                <span className="text-[10px] leading-tight text-white/35">
                  {g.hint}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {status === "thinking" && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white/50"
            >
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
              Refining your itinerary...
            </motion.div>
          )}

          {status === "idle" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-accent/20 bg-accent/[0.05] p-4"
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15">
                  {result.changed ? (
                    <Check className="h-3.5 w-3.5 text-accent" />
                  ) : (
                    <Info className="h-3.5 w-3.5 text-accent" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed text-white/80">
                    {result.summary}
                  </p>

                  {result.changed && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-white/50">
                        {result.changes.length} change
                        {result.changes.length > 1 ? "s" : ""}
                      </span>
                      {saved > 0 && (
                        <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-200">
                          Saved €{saved}
                        </span>
                      )}
                    </div>
                  )}

                  {result.changes.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {result.changes.slice(0, 8).map((c, i) => {
                        const Icon = CHANGE_ICONS[c.type];
                        return (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-white/50"
                          >
                            <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent/70" />
                            <span>
                              <span className="text-white/30">Day {c.day}:</span>{" "}
                              {c.type === "replaced" && (
                                <>
                                  swapped{" "}
                                  <span className="text-white/70">{c.from}</span>{" "}
                                  for{" "}
                                  <span className="text-white/70">{c.to}</span>
                                </>
                              )}
                              {c.type === "removed" && (
                                <>
                                  removed{" "}
                                  <span className="text-white/70">{c.from}</span>
                                </>
                              )}
                              {c.type === "added" && (
                                <>
                                  added{" "}
                                  <span className="text-white/70">{c.to}</span>
                                </>
                              )}
                              {c.type === "reordered" && (
                                <>reordered stops to cut travel time</>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    {snapshot && (
                      <button
                        onClick={onUndo}
                        className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs font-medium text-white/60 transition-all hover:text-white"
                      >
                        <Undo2 className="h-3.5 w-3.5" />
                        Undo
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setResult(null);
                        setSnapshot(null);
                      }}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-white/40 transition-all hover:text-white/70"
                    >
                      Dismiss
                    </button>
                    {result.changed && (
                      <span className="ml-auto text-[11px] text-white/30">
                        Still fully editable below
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
