"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Users,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
}

interface BookingPanelProps {
  activityId: string;
  activityTitle: string;
  price: number;
  currency: string;
  maxGroupSize: number;
}

export function BookingPanel({
  activityId,
  activityTitle: _activityTitle,
  price,
  currency,
  maxGroupSize,
}: BookingPanelProps) {
  const router = useRouter();
  const [step, setStep] = useState<"date" | "confirm">("date");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected values
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [participants, setParticipants] = useState(1);
  const [notes, setNotes] = useState("");

  // Calendar month offset from current
  const [monthOffset, setMonthOffset] = useState(0);

  // Fetch available slots
  useEffect(() => {
    setLoadingSlots(true);
    fetch(`/api/timeslots?activityId=${activityId}`)
      .then((r) => r.json())
      .then((data) => {
        setSlots(data.slots || []);
        setLoadingSlots(false);
      })
      .catch(() => {
        setSlots([]);
        setLoadingSlots(false);
      });
  }, [activityId]);

  // Group slots by date string (YYYY-MM-DD)
  const slotsByDate = useCallback(() => {
    const map: Record<string, TimeSlot[]> = {};
    for (const s of slots) {
      const dateKey = new Date(s.date).toISOString().split("T")[0];
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(s);
    }
    return map;
  }, [slots]);

  const grouped = slotsByDate();
  const availableDates = new Set(Object.keys(grouped));

  // Calendar helpers
  const now = new Date();
  const calendarMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthName = calendarMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDayOfMonth = calendarMonth.getDay();
  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0
  ).getDate();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  function dateKey(day: number) {
    const y = calendarMonth.getFullYear();
    const m = String(calendarMonth.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function handleDateClick(day: number) {
    const key = dateKey(day);
    if (!availableDates.has(key)) return;
    setSelectedDate(key);
    setSelectedSlot(null);
  }

  function handleSlotSelect(slot: TimeSlot) {
    setSelectedSlot(slot);
    setError(null);
  }

  const maxParticipants = selectedSlot
    ? Math.min(maxGroupSize, selectedSlot.capacity - selectedSlot.bookedCount)
    : maxGroupSize;

  const totalPrice = price * participants;

  async function handleBooking() {
    if (!selectedSlot) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId,
          timeSlotId: selectedSlot.id,
          participants,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Navigate to confirmation page
      router.push(`/booking/confirmation?id=${data.booking.id}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  const slotsForDate = selectedDate ? grouped[selectedDate] || [] : [];

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
      {/* Price header */}
      <div className="mb-1 flex items-baseline gap-1.5">
        <span className="font-display text-3xl font-bold text-white">
          {currency}
          {price}
        </span>
        <span className="text-sm text-white/40">/ person</span>
      </div>

      <AnimatePresence mode="wait">
        {step === "date" ? (
          <motion.div
            key="date-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Mini calendar */}
            <div className="mt-5 mb-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
                  <CalendarDays className="h-4 w-4 text-accent" />
                  Select a Date
                </h4>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMonthOffset((o) => Math.max(0, o - 1))}
                    disabled={monthOffset === 0}
                    className="rounded p-1 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="min-w-[120px] text-center text-xs text-white/50">
                    {monthName}
                  </span>
                  <button
                    onClick={() => setMonthOffset((o) => o + 1)}
                    className="rounded p-1 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {loadingSlots ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-accent" />
                </div>
              ) : (
                <>
                  {/* Day headers */}
                  <div className="mb-1 grid grid-cols-7 gap-1">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                      <div
                        key={d}
                        className="text-center text-[10px] font-medium text-white/25"
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, i) => {
                      if (day === null) return <div key={`e-${i}`} />;
                      const key = dateKey(day);
                      const hasSlots = availableDates.has(key);
                      const isSelected = selectedDate === key;
                      const isPast =
                        new Date(key) <
                        new Date(now.toISOString().split("T")[0]);

                      return (
                        <button
                          key={key}
                          onClick={() => handleDateClick(day)}
                          disabled={!hasSlots || isPast}
                          className={`aspect-square rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? "bg-accent text-white shadow-lg shadow-accent/25"
                              : hasSlots && !isPast
                                ? "bg-white/[0.04] text-white hover:bg-accent/20 hover:text-accent"
                                : "text-white/15 cursor-default"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Time slots for selected date */}
            <AnimatePresence>
              {selectedDate && slotsForDate.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                    <Clock className="h-4 w-4 text-accent" />
                    Available Times
                  </h4>
                  <div className="space-y-2">
                    {slotsForDate.map((slot) => {
                      const remaining = slot.capacity - slot.bookedCount;
                      const isSelected = selectedSlot?.id === slot.id;
                      return (
                        <button
                          key={slot.id}
                          onClick={() => handleSlotSelect(slot)}
                          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all ${
                            isSelected
                              ? "border-accent/50 bg-accent/10 text-white"
                              : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:border-white/[0.15] hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="font-medium">
                              {slot.startTime} – {slot.endTime}
                            </span>
                          </div>
                          <span
                            className={`text-xs ${remaining <= 3 ? "text-amber-400" : "text-white/30"}`}
                          >
                            {remaining} spots left
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Continue button */}
                  {selectedSlot && (
                    <motion.button
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setStep("confirm")}
                      className="btn-primary mt-4 w-full !rounded-xl !py-3.5"
                    >
                      Continue to Booking
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {selectedDate && slotsForDate.length === 0 && (
              <p className="py-4 text-center text-xs text-white/30">
                No available slots for this date
              </p>
            )}

            {!selectedDate && !loadingSlots && (
              <p className="mt-2 text-center text-[10px] text-white/25">
                Select a highlighted date to see available times
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="confirm-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Back button */}
            <button
              onClick={() => setStep("date")}
              className="mt-4 mb-5 flex items-center gap-1 text-xs text-white/40 transition-colors hover:text-white"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Change date & time
            </button>

            {/* Booking summary */}
            <div className="space-y-3 border-b border-white/[0.06] pb-5 mb-5">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="text-xs text-white/30 mb-1">Date & Time</p>
                <p className="text-sm font-medium text-white">
                  {selectedDate &&
                    new Date(selectedDate + "T12:00:00").toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                </p>
                <p className="text-sm text-white/60">
                  {selectedSlot?.startTime} – {selectedSlot?.endTime}
                </p>
              </div>
            </div>

            {/* Participants */}
            <div className="mb-5">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                <Users className="h-4 w-4 text-accent" />
                Participants
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setParticipants((p) => Math.max(1, p - 1))}
                  disabled={participants <= 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-white transition-all hover:bg-white/[0.08] disabled:opacity-30"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[2rem] text-center text-lg font-bold text-white">
                  {participants}
                </span>
                <button
                  onClick={() =>
                    setParticipants((p) => Math.min(maxParticipants, p + 1))
                  }
                  disabled={participants >= maxParticipants}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-white transition-all hover:bg-white/[0.08] disabled:opacity-30"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs text-white/30">
                  max {maxParticipants}
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-white">
                Special Requests{" "}
                <span className="font-normal text-white/30">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
                rows={2}
                placeholder="Dietary requirements, accessibility needs..."
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/25"
              />
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 mb-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">
                  {currency}
                  {price} × {participants}{" "}
                  {participants === 1 ? "person" : "people"}
                </span>
                <span className="text-white/60">
                  {currency}
                  {totalPrice}
                </span>
              </div>
              <div className="border-t border-white/[0.06] pt-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-white">Total</span>
                <span className="font-display text-lg font-bold text-white">
                  {currency}
                  {totalPrice}
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            )}

            {/* Confirm button */}
            <button
              onClick={handleBooking}
              disabled={loading}
              className="btn-primary w-full !rounded-xl !py-3.5 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Confirm Booking — {currency}
                  {totalPrice}
                </>
              )}
            </button>
            <p className="mt-3 text-center text-[10px] text-white/25">
              Free cancellation up to 24h before
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
