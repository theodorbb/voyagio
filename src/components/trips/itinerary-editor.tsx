"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { SafeImage } from "@/components/shared/safe-image";
import {
  Clock,
  Compass,
  Star,
  Utensils,
  Mountain,
  Palette,
  Waves,
  Camera,
  Heart,
  Moon,
  TreePine,
  ExternalLink,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  RefreshCw,
  Replace,
  AlertTriangle,
  GripVertical,
  Search,
  X,
  Check,
} from "lucide-react";

export interface AvailableActivity {
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
  latitude?: number | null;
  longitude?: number | null;
}

export interface EditableActivity extends AvailableActivity {
  timeOfDay: string | null;
  startTime: string | null;
}

export interface EditableDay {
  dayNumber: number;
  activities: EditableActivity[];
}

export type ToastVariant = "success" | "error" | "warning";
export interface ToastState {
  message: string;
  variant: ToastVariant;
}

export const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Food & Wine": Utensils,
  Cultural: Palette,
  Adventure: Mountain,
  Nature: TreePine,
  "Water Sports": Waves,
  Wellness: Heart,
  Photography: Camera,
  Nightlife: Moon,
};

export const TIME_COLORS: Record<string, string> = {
  morning: "from-amber-500/20 to-amber-500/5 border-amber-500/20",
  afternoon: "from-sky-500/20 to-sky-500/5 border-sky-500/20",
  evening: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/20",
};

export const TIME_LABELS: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

export const TIME_SLOTS = [
  { timeOfDay: "morning", start: "09:00" },
  { timeOfDay: "afternoon", start: "14:00" },
  { timeOfDay: "evening", start: "18:00" },
  { timeOfDay: "evening", start: "20:00" },
];

export const PACE_TARGET: Record<string, number> = {
  light: 2,
  balanced: 3,
  packed: 4,
};

export function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function firstImage(images: string): string {
  try {
    const arr = JSON.parse(images);
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : "";
  } catch {
    return "";
  }
}

export function withTimes(activities: EditableActivity[]): EditableActivity[] {
  return activities.map((a, i) => {
    const slot = TIME_SLOTS[Math.min(i, TIME_SLOTS.length - 1)];
    return { ...a, timeOfDay: slot.timeOfDay, startTime: slot.start };
  });
}

export function availableToEditable(a: AvailableActivity): EditableActivity {
  return { ...a, timeOfDay: null, startTime: null };
}

export function paceTargetFor(pace: unknown): number {
  return PACE_TARGET[String(pace)] ?? 3;
}

export interface ItineraryEditor {
  working: EditableDay[];
  editing: boolean;
  setEditing: (v: boolean) => void;
  dirty: boolean;
  setDirty: (v: boolean) => void;
  paceTarget: number;
  totals: { cost: number; count: number; duration: number };
  usedIds: Set<string>;
  availableActivities: AvailableActivity[];
  toast: ToastState | null;
  showToast: (message: string, variant?: ToastVariant) => void;
  picker:
    | { mode: "add"; dayNumber: number }
    | { mode: "replace"; dayNumber: number; index: number }
    | null;
  setPicker: (
    p:
      | { mode: "add"; dayNumber: number }
      | { mode: "replace"; dayNumber: number; index: number }
      | null
  ) => void;
  pickerOptions: AvailableActivity[];
  removeActivity: (dayNumber: number, index: number) => void;
  moveWithinDay: (dayNumber: number, index: number, dir: -1 | 1) => void;
  reorderDay: (dayNumber: number, next: EditableActivity[]) => void;
  moveToDay: (fromDay: number, index: number, toDay: number) => void;
  addActivity: (dayNumber: number, activity: AvailableActivity) => void;
  replaceActivity: (
    dayNumber: number,
    index: number,
    activity: AvailableActivity
  ) => void;
  regenerateDay: (dayNumber: number) => void;
  reset: (days: EditableDay[]) => void;
  applyDays: (days: EditableDay[]) => void;
  getSavePayload: () => Array<{
    dayNumber: number;
    activities: Array<{ id: string; startTime: string | null; timeOfDay: string | null }>;
  }>;
}

export function useItineraryEditor({
  initialDays,
  availableActivities,
  paceTarget,
}: {
  initialDays: EditableDay[];
  availableActivities: AvailableActivity[];
  paceTarget: number;
}): ItineraryEditor {
  const [editing, setEditing] = useState(false);
  const [working, setWorking] = useState<EditableDay[]>(() => initialDays);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<number | null>(null);

  const [picker, setPicker] = useState<
    | { mode: "add"; dayNumber: number }
    | { mode: "replace"; dayNumber: number; index: number }
    | null
  >(null);

  const totals = useMemo(() => {
    let cost = 0;
    let count = 0;
    let duration = 0;
    for (const day of working) {
      for (const a of day.activities) {
        cost += a.price;
        count += 1;
        duration += a.duration;
      }
    }
    return { cost, count, duration };
  }, [working]);

  const usedIds = useMemo(
    () => new Set(working.flatMap((d) => d.activities.map((a) => a.id))),
    [working]
  );

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      setToast({ message, variant });
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(
        () => setToast(null),
        variant === "success" ? 2600 : 4000
      );
    },
    []
  );

  const markDirty = useCallback(() => {
    setDirty(true);
  }, []);

  const mutateDay = useCallback(
    (dayNumber: number, fn: (acts: EditableActivity[]) => EditableActivity[]) => {
      setWorking((prev) =>
        prev.map((d) =>
          d.dayNumber === dayNumber
            ? { ...d, activities: withTimes(fn([...d.activities])) }
            : d
        )
      );
      markDirty();
    },
    [markDirty]
  );

  const removeActivity = useCallback(
    (dayNumber: number, index: number) => {
      mutateDay(dayNumber, (acts) => acts.filter((_, i) => i !== index));
    },
    [mutateDay]
  );

  const moveWithinDay = useCallback(
    (dayNumber: number, index: number, dir: -1 | 1) => {
      mutateDay(dayNumber, (acts) => {
        const target = index + dir;
        if (target < 0 || target >= acts.length) return acts;
        const next = [...acts];
        [next[index], next[target]] = [next[target], next[index]];
        return next;
      });
    },
    [mutateDay]
  );

  const reorderDay = useCallback(
    (dayNumber: number, next: EditableActivity[]) => {
      setWorking((prev) =>
        prev.map((d) =>
          d.dayNumber === dayNumber ? { ...d, activities: withTimes(next) } : d
        )
      );
      markDirty();
    },
    [markDirty]
  );

  const moveToDay = useCallback(
    (fromDay: number, index: number, toDay: number) => {
      let crowdedCount = 0;
      setWorking((prev) => {
        const source = prev.find((d) => d.dayNumber === fromDay);
        if (!source) return prev;
        const moving = source.activities[index];
        if (!moving) return prev;
        return prev.map((d) => {
          if (d.dayNumber === fromDay) {
            return {
              ...d,
              activities: withTimes(d.activities.filter((_, i) => i !== index)),
            };
          }
          if (d.dayNumber === toDay) {
            const merged = withTimes([...d.activities, moving]);
            crowdedCount = merged.length;
            return { ...d, activities: merged };
          }
          return d;
        });
      });
      markDirty();
      if (crowdedCount > paceTarget) {
        showToast(
          `Day ${toDay} is getting busy with ${crowdedCount} activities.`,
          "warning"
        );
      }
    },
    [paceTarget, showToast, markDirty]
  );

  const addActivity = useCallback(
    (dayNumber: number, activity: AvailableActivity) => {
      mutateDay(dayNumber, (acts) => [...acts, availableToEditable(activity)]);
      setPicker(null);
    },
    [mutateDay]
  );

  const replaceActivity = useCallback(
    (dayNumber: number, index: number, activity: AvailableActivity) => {
      mutateDay(dayNumber, (acts) =>
        acts.map((a, i) => (i === index ? availableToEditable(activity) : a))
      );
      setPicker(null);
    },
    [mutateDay]
  );

  const regenerateDay = useCallback(
    (dayNumber: number) => {
      const usedElsewhere = new Set(
        working
          .filter((d) => d.dayNumber !== dayNumber)
          .flatMap((d) => d.activities.map((a) => a.id))
      );
      const pool = availableActivities
        .filter((a) => !usedElsewhere.has(a.id))
        .sort((a, b) => b.rating - a.rating);

      const picked: AvailableActivity[] = [];
      const cats = new Set<string>();
      for (const a of pool) {
        if (picked.length >= paceTarget) break;
        if (!cats.has(a.category)) {
          picked.push(a);
          cats.add(a.category);
        }
      }
      for (const a of pool) {
        if (picked.length >= paceTarget) break;
        if (!picked.includes(a)) picked.push(a);
      }

      setWorking((prev) =>
        prev.map((d) =>
          d.dayNumber === dayNumber
            ? { ...d, activities: withTimes(picked.map(availableToEditable)) }
            : d
        )
      );
      markDirty();
      if (picked.length === 0) {
        showToast(
          `No alternative activities are available to rebuild day ${dayNumber}.`,
          "warning"
        );
      } else {
        showToast(`Day ${dayNumber} rebuilt with ${picked.length} activities.`);
      }
    },
    [working, availableActivities, paceTarget, showToast, markDirty]
  );

  const reset = useCallback((days: EditableDay[]) => {
    setWorking(days);
    setDirty(false);
    setPicker(null);
  }, []);

  const applyDays = useCallback((days: EditableDay[]) => {
    setWorking(days.map((d) => ({ ...d, activities: withTimes(d.activities) })));
    setDirty(true);
    setPicker(null);
  }, []);

  const pickerOptions = useMemo(() => {
    if (!picker) return [];
    return availableActivities.filter((a) => !usedIds.has(a.id));
  }, [picker, availableActivities, usedIds]);

  const getSavePayload = useCallback(
    () =>
      working.map((d) => ({
        dayNumber: d.dayNumber,
        activities: d.activities.map((a) => ({
          id: a.id,
          startTime: a.startTime,
          timeOfDay: a.timeOfDay,
        })),
      })),
    [working]
  );

  return {
    working,
    editing,
    setEditing,
    dirty,
    setDirty,
    paceTarget,
    totals,
    usedIds,
    availableActivities,
    toast,
    showToast,
    picker,
    setPicker,
    pickerOptions,
    removeActivity,
    moveWithinDay,
    reorderDay,
    moveToDay,
    addActivity,
    replaceActivity,
    regenerateDay,
    reset,
    applyDays,
    getSavePayload,
  };
}

export function ItineraryBoard({ editor }: { editor: ItineraryEditor }) {
  const { working, editing, paceTarget, regenerateDay, setPicker } = editor;

  return (
    <div className="space-y-6">
      {working.map((day) => {
        const dayCost = day.activities.reduce((s, a) => s + a.price, 0);
        const crowded = day.activities.length > paceTarget;
        return (
          <div key={day.dayNumber}>
            <div className="mb-4 flex flex-wrap items-center gap-3">
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
                    : `${day.activities.length} activit${day.activities.length === 1 ? "y" : "ies"} · €${dayCost} est.`}
                </p>
              </div>

              {editing && (
                <div className="ml-auto flex items-center gap-2">
                  {crowded && (
                    <span className="flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-[10px] font-medium text-amber-300">
                      <AlertTriangle className="h-3 w-3" />
                      Busy day
                    </span>
                  )}
                  <button
                    onClick={() => regenerateDay(day.dayNumber)}
                    className="flex items-center gap-1 rounded-lg border border-white/[0.08] px-2.5 py-1.5 text-[10px] font-medium text-white/50 transition-all hover:border-accent/30 hover:text-accent"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Rebuild day
                  </button>
                  <button
                    onClick={() => setPicker({ mode: "add", dayNumber: day.dayNumber })}
                    className="flex items-center gap-1 rounded-lg bg-accent/15 px-2.5 py-1.5 text-[10px] font-bold text-accent transition-all hover:bg-accent/25"
                  >
                    <Plus className="h-3 w-3" />
                    Add activity
                  </button>
                </div>
              )}
            </div>

            {day.activities.length === 0 ? (
              <div className="ml-5 border-l-2 border-white/[0.06] pl-6">
                <div className="rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01] p-6 text-center">
                  <p className="text-xs text-white/20">
                    {editing
                      ? "Free day. Add an activity or rebuild the day to fill it."
                      : "Free day. Explore on your own."}
                  </p>
                </div>
              </div>
            ) : editing ? (
              <Reorder.Group
                axis="y"
                values={day.activities}
                onReorder={(next) => editor.reorderDay(day.dayNumber, next)}
                className="space-y-3 border-l-2 border-white/[0.06] pl-6 ml-5"
              >
                {day.activities.map((act, ai) => (
                  <EditableActivityCard
                    key={act.id}
                    act={act}
                    index={ai}
                    dayNumber={day.dayNumber}
                    total={day.activities.length}
                    days={working.map((d) => d.dayNumber)}
                    onRemove={() => editor.removeActivity(day.dayNumber, ai)}
                    onMoveUp={() => editor.moveWithinDay(day.dayNumber, ai, -1)}
                    onMoveDown={() => editor.moveWithinDay(day.dayNumber, ai, 1)}
                    onMoveToDay={(to) => editor.moveToDay(day.dayNumber, ai, to)}
                    onReplace={() =>
                      setPicker({ mode: "replace", dayNumber: day.dayNumber, index: ai })
                    }
                  />
                ))}
              </Reorder.Group>
            ) : (
              <div className="space-y-3 border-l-2 border-white/[0.06] pl-6 ml-5">
                {day.activities.map((act, ai) => (
                  <ReadActivityCard key={`${day.dayNumber}-${ai}`} act={act} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ReadActivityCard({ act }: { act: EditableActivity }) {
  const CatIcon = CATEGORY_ICONS[act.category] || Compass;
  const img = firstImage(act.images);
  const timeOfDay = act.timeOfDay || "morning";
  const timeColor = TIME_COLORS[timeOfDay] || TIME_COLORS.morning;

  return (
    <div className="relative">
      <div className="absolute -left-[31px] top-4 h-3 w-3 rounded-full border-2 border-accent/50 bg-[var(--background)]" />
      <div className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all hover:border-white/[0.12]">
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-28 w-full shrink-0 sm:h-auto sm:w-32">
            <SafeImage
              src={img}
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
            <p className="font-display text-sm font-bold text-white">{act.title}</p>
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
}

export function EditableActivityCard({
  act,
  index,
  dayNumber,
  total,
  days,
  onRemove,
  onMoveUp,
  onMoveDown,
  onMoveToDay,
  onReplace,
}: {
  act: EditableActivity;
  index: number;
  dayNumber: number;
  total: number;
  days: number[];
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveToDay: (toDay: number) => void;
  onReplace: () => void;
}) {
  const CatIcon = CATEGORY_ICONS[act.category] || Compass;
  const img = firstImage(act.images);
  const timeOfDay = act.timeOfDay || "morning";
  const timeColor = TIME_COLORS[timeOfDay] || TIME_COLORS.morning;
  const otherDays = days.filter((d) => d !== dayNumber);

  return (
    <Reorder.Item value={act} className="relative list-none">
      <div className="absolute -left-[31px] top-4 h-3 w-3 rounded-full border-2 border-accent/50 bg-[var(--background)]" />
      <div className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all hover:border-accent/20">
        <div className="flex flex-col sm:flex-row">
          <div className="relative flex w-full items-center justify-center bg-white/[0.02] py-2 sm:w-10 sm:flex-col sm:py-0">
            <GripVertical className="h-4 w-4 cursor-grab text-white/20 transition-colors group-hover:text-white/40 active:cursor-grabbing" />
          </div>
          <div className="relative h-28 w-full shrink-0 sm:h-auto sm:w-28">
            <SafeImage
              src={img}
              alt={act.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 112px"
            />
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
            <p className="font-display text-sm font-bold text-white">{act.title}</p>
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
              <span className="font-display text-sm font-bold text-white">
                {act.currency}{act.price}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-white/[0.06] pt-3">
              <button
                onClick={onMoveUp}
                disabled={index === 0}
                title="Move earlier"
                className="rounded-md border border-white/[0.08] p-1.5 text-white/40 transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={onMoveDown}
                disabled={index === total - 1}
                title="Move later"
                className="rounded-md border border-white/[0.08] p-1.5 text-white/40 transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {otherDays.length > 0 && (
                <div className="relative inline-flex items-center">
                  <ArrowUpDown className="pointer-events-none absolute left-1.5 h-3 w-3 text-white/40" />
                  <select
                    value=""
                    onChange={(e) => {
                      const to = Number(e.target.value);
                      if (to) onMoveToDay(to);
                    }}
                    title="Move to another day"
                    className="appearance-none rounded-md border border-white/[0.08] bg-transparent py-1.5 pl-6 pr-2 text-[10px] text-white/50 transition-all hover:text-white focus:outline-none"
                  >
                    <option value="" className="bg-[var(--background)]">
                      Day
                    </option>
                    {otherDays.map((d) => (
                      <option key={d} value={d} className="bg-[var(--background)]">
                        Day {d}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={onReplace}
                title="Replace activity"
                className="flex items-center gap-1 rounded-md border border-white/[0.08] px-2 py-1.5 text-[10px] text-white/40 transition-all hover:border-accent/30 hover:text-accent"
              >
                <Replace className="h-3 w-3" />
                Replace
              </button>
              <button
                onClick={onRemove}
                title="Remove activity"
                className="ml-auto flex items-center gap-1 rounded-md border border-red-400/20 px-2 py-1.5 text-[10px] text-red-300/70 transition-all hover:border-red-400/40 hover:text-red-300"
              >
                <Trash2 className="h-3 w-3" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
}

export function ActivityPickerDialog({ editor }: { editor: ItineraryEditor }) {
  const { picker, pickerOptions, setPicker, addActivity, replaceActivity } = editor;

  return (
    <AnimatePresence>
      {picker && (
        <ActivityPicker
          mode={picker.mode}
          options={pickerOptions}
          onClose={() => setPicker(null)}
          onSelect={(activity) => {
            if (picker.mode === "add") {
              addActivity(picker.dayNumber, activity);
            } else {
              replaceActivity(picker.dayNumber, picker.index, activity);
            }
          }}
        />
      )}
    </AnimatePresence>
  );
}

function ActivityPicker({
  mode,
  options,
  onClose,
  onSelect,
}: {
  mode: "add" | "replace";
  options: AvailableActivity[];
  onClose: () => void;
  onSelect: (activity: AvailableActivity) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    options.forEach((o) => set.add(o.category));
    return ["all", ...Array.from(set).sort()];
  }, [options]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter((o) => {
      const matchCat = category === "all" || o.category === category;
      const matchQuery =
        !q ||
        o.title.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [options, query, category]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-white/[0.12] bg-[var(--background)] shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] p-5">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              {mode === "add" ? "Add an activity" : "Replace activity"}
            </h3>
            <p className="text-xs text-white/30">
              {filtered.length} experiences available for this destination
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/[0.08] p-2 text-white/40 transition-all hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 border-b border-white/[0.08] p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or category..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:border-accent/40 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1 text-[10px] font-medium transition-all ${
                  category === c
                    ? "border-accent/40 bg-accent/15 text-accent"
                    : "border-white/[0.06] bg-white/[0.03] text-white/40 hover:text-white"
                }`}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-white/30">
              No activities match your search.
            </p>
          ) : (
            <div className="space-y-2">
              {filtered.map((o) => {
                const CatIcon = CATEGORY_ICONS[o.category] || Compass;
                const img = firstImage(o.images);
                return (
                  <button
                    key={o.id}
                    onClick={() => onSelect(o)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-2.5 text-left transition-all hover:border-accent/30 hover:bg-white/[0.04]"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                      <SafeImage src={img} alt={o.title} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-bold text-white">
                        {o.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-white/30">
                        <span className="flex items-center gap-1">
                          <CatIcon className="h-2.5 w-2.5" />
                          {o.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {formatDuration(o.duration)}
                        </span>
                        {o.rating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                            {o.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="font-display text-sm font-bold text-white">
                        {o.currency}{o.price}
                      </span>
                      <span className="rounded-lg bg-accent/15 p-1.5 text-accent transition-all group-hover:bg-accent group-hover:text-white">
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function EditorToast({ editor }: { editor: ItineraryEditor }) {
  const { toast } = editor;
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 left-1/2 z-50 flex max-w-[90vw] -translate-x-1/2 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm shadow-2xl backdrop-blur ${
            toast.variant === "error"
              ? "border-red-400/30 bg-red-500/15 text-red-100"
              : toast.variant === "warning"
                ? "border-amber-400/30 bg-amber-500/15 text-amber-100"
                : "border-emerald-400/30 bg-emerald-500/15 text-emerald-50"
          }`}
        >
          {toast.variant === "success" ? (
            <Check className="h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
