"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  CalendarDays,
  Clock,
  Users,
  Loader2,
  X,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface TimeSlotData {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  status: string;
  activity: { id: string; title: string; slug: string; maxGroupSize: number };
  bookingCount: number;
  utilization: number;
}

interface Props {
  activities: Array<{ id: string; title: string; maxGroupSize: number }>;
}

const slotStatusColors: Record<string, string> = {
  AVAILABLE: "border-emerald-500/20 bg-emerald-500/5",
  FULL: "border-amber-500/20 bg-amber-500/5",
  CANCELLED: "border-red-500/20 bg-red-500/5 opacity-50",
};

export function ScheduleManagementClient({ activities }: Props) {
  const [slots, setSlots] = useState<TimeSlotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [showCreate, setShowCreate] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);

  // Read activityId from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const actId = params.get("activityId");
    if (actId) setSelectedActivity(actId);
  }, []);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedActivity) params.set("activityId", selectedActivity);
    // Show from today
    params.set("dateFrom", new Date().toISOString().slice(0, 10));

    const res = await fetch(`/api/operator/timeslots?${params}`);
    if (res.ok) {
      const data = await res.json();
      setSlots(data.timeSlots);
    }
    setLoading(false);
  }, [selectedActivity]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const cancelSlot = async (id: string) => {
    setCancelling(id);
    const res = await fetch(`/api/operator/timeslots/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    if (res.ok) {
      setSlots((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "CANCELLED" } : s))
      );
    }
    setCancelling(null);
  };

  // Group slots by date
  const grouped: Record<string, TimeSlotData[]> = {};
  for (const slot of slots) {
    const dateKey = new Date(slot.date).toISOString().slice(0, 10);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(slot);
  }

  const dateKeys = Object.keys(grouped).sort();

  return (
    <div className="min-h-screen pb-12 pt-24">
      <div className="section-container">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <Link
            href="/dashboard/operator"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
                Schedule & Time Slots
              </h1>
              <p className="mt-1 text-sm text-white/40">
                Manage availability for your activities
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              disabled={activities.length === 0}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              Add Slots
            </button>
          </div>
        </motion.div>

        {/* Activity filter */}
        <div className="mb-6">
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-accent/30 focus:outline-none"
          >
            <option value="" className="bg-[#1a1a2e]">
              All Activities
            </option>
            {activities.map((a) => (
              <option key={a.id} value={a.id} className="bg-[#1a1a2e]">
                {a.title}
              </option>
            ))}
          </select>
        </div>

        {/* Slots grouped by date */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-white/20" />
          </div>
        ) : dateKeys.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-16 text-center">
            <CalendarDays className="mb-3 h-8 w-8 text-white/15" />
            <p className="text-sm text-white/40">No upcoming time slots</p>
            <button
              onClick={() => setShowCreate(true)}
              className="btn-primary mt-4 text-sm"
            >
              Create Time Slots
            </button>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {dateKeys.map((dateKey) => {
              const daySlots = grouped[dateKey];
              const dateObj = new Date(dateKey + "T12:00:00");
              const totalCapacity = daySlots.reduce(
                (s, sl) => s + sl.capacity,
                0
              );
              const totalBooked = daySlots.reduce(
                (s, sl) => s + sl.bookedCount,
                0
              );
              const dayUtil =
                totalCapacity > 0
                  ? Math.round((totalBooked / totalCapacity) * 100)
                  : 0;

              return (
                <motion.div key={dateKey} variants={fadeInUp}>
                  {/* Date header */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                        <span className="text-[10px] uppercase text-white/30">
                          {dateObj.toLocaleDateString("en", { month: "short" })}
                        </span>
                        <span className="text-lg font-bold text-white">
                          {dateObj.getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {dateObj.toLocaleDateString("en", {
                            weekday: "long",
                          })}
                        </p>
                        <p className="text-xs text-white/30">
                          {daySlots.length} slot
                          {daySlots.length !== 1 ? "s" : ""} · {totalBooked}/
                          {totalCapacity} booked
                        </p>
                      </div>
                    </div>

                    {/* Day utilization bar */}
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            dayUtil > 80
                              ? "bg-emerald-400"
                              : dayUtil > 40
                              ? "bg-primary-light"
                              : "bg-white/20"
                          )}
                          style={{ width: `${dayUtil}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/40">{dayUtil}%</span>
                    </div>
                  </div>

                  {/* Slot cards */}
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={cn(
                          "rounded-xl border p-4 transition-all",
                          slotStatusColors[slot.status]
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-medium text-white/60">
                              {slot.activity.title}
                            </p>
                            <div className="mt-1 flex items-center gap-3 text-sm">
                              <span className="flex items-center gap-1 font-semibold text-white">
                                <Clock className="h-3.5 w-3.5 text-white/30" />
                                {slot.startTime} – {slot.endTime}
                              </span>
                            </div>
                          </div>
                          {slot.status !== "CANCELLED" && (
                            <button
                              onClick={() => cancelSlot(slot.id)}
                              disabled={cancelling === slot.id}
                              className="rounded-lg p-1 text-white/20 hover:bg-red-500/10 hover:text-red-400"
                              title="Cancel slot"
                            >
                              {cancelling === slot.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Utilization */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1 text-white/40">
                              <Users className="h-3 w-3" />
                              {slot.bookedCount}/{slot.capacity}
                            </span>
                            <span
                              className={cn(
                                "font-medium",
                                slot.utilization > 80
                                  ? "text-emerald-400"
                                  : slot.utilization > 40
                                  ? "text-primary-light"
                                  : "text-white/30"
                              )}
                            >
                              {slot.utilization}%
                            </span>
                          </div>
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                slot.status === "FULL"
                                  ? "bg-amber-400"
                                  : slot.utilization > 60
                                  ? "bg-emerald-400"
                                  : "bg-primary-light/60"
                              )}
                              style={{
                                width: `${Math.min(100, slot.utilization)}%`,
                              }}
                            />
                          </div>
                        </div>

                        {slot.status === "CANCELLED" && (
                          <p className="mt-2 text-[10px] font-medium text-red-400">
                            CANCELLED
                          </p>
                        )}
                        {slot.status === "FULL" && (
                          <p className="mt-2 text-[10px] font-medium text-amber-400">
                            FULLY BOOKED
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Create Slots Modal */}
        {showCreate && (
          <CreateSlotsModal
            activities={activities}
            preselectedActivity={selectedActivity}
            onClose={() => setShowCreate(false)}
            onCreated={() => {
              setShowCreate(false);
              fetchSlots();
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Create Slots Modal ─────────────────────
function CreateSlotsModal({
  activities,
  preselectedActivity,
  onClose,
  onCreated,
}: {
  activities: Array<{ id: string; title: string; maxGroupSize: number }>;
  preselectedActivity: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    activityId: preselectedActivity || activities[0]?.id || "",
    startTime: "09:00",
    endTime: "12:00",
    capacity: 12,
    dateFrom: "",
    dateTo: "",
  });

  // Set default dates to next 7 days
  useEffect(() => {
    const today = new Date();
    const next = new Date();
    next.setDate(today.getDate() + 7);
    setForm((f) => ({
      ...f,
      dateFrom: today.toISOString().slice(0, 10),
      dateTo: next.toISOString().slice(0, 10),
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Generate date array from range
    const dates: string[] = [];
    const start = new Date(form.dateFrom);
    const end = new Date(form.dateTo);
    const current = new Date(start);

    while (current <= end) {
      dates.push(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 1);
    }

    if (dates.length === 0) {
      setError("Please select a valid date range");
      setSaving(false);
      return;
    }

    if (dates.length > 90) {
      setError("Maximum 90 days at a time");
      setSaving(false);
      return;
    }

    const res = await fetch("/api/operator/timeslots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activityId: form.activityId,
        startTime: form.startTime,
        endTime: form.endTime,
        capacity: form.capacity,
        dates,
      }),
    });

    if (res.ok) {
      onCreated();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create slots");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card mx-4 w-full max-w-md p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">
            Create Time Slots
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/40 hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">
              Activity
            </label>
            <select
              value={form.activityId}
              onChange={(e) =>
                setForm({ ...form, activityId: e.target.value })
              }
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-accent/30 focus:outline-none"
            >
              {activities.map((a) => (
                <option key={a.id} value={a.id} className="bg-[#1a1a2e]">
                  {a.title} (max {a.maxGroupSize})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">
                Start Time
              </label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-accent/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">
                End Time
              </label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) =>
                  setForm({ ...form, endTime: e.target.value })
                }
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-accent/30 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">
              Capacity per slot
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={form.capacity}
              onChange={(e) =>
                setForm({ ...form, capacity: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-accent/30 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">
                From Date
              </label>
              <input
                type="date"
                required
                value={form.dateFrom}
                onChange={(e) =>
                  setForm({ ...form, dateFrom: e.target.value })
                }
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-accent/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">
                To Date
              </label>
              <input
                type="date"
                required
                value={form.dateTo}
                onChange={(e) =>
                  setForm({ ...form, dateTo: e.target.value })
                }
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-accent/30 focus:outline-none"
              />
            </div>
          </div>

          <p className="text-[10px] text-white/30">
            This will create one time slot per day in the selected date range.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Create Slots
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
