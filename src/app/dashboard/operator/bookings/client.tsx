"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Users,
  DollarSign,
  Loader2,
  CheckCircle2,
  XCircle,
  Mail,
  FileText,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface BookingData {
  id: string;
  participants: number;
  totalPrice: number;
  status: string;
  notes: string | null;
  createdAt: string;
  activity: {
    id: string;
    title: string;
    slug: string;
    price: number;
    currency: string;
  };
  user: { name: string; email: string };
  timeSlot: {
    date: string;
    startTime: string;
    endTime: string;
  } | null;
}

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  COMPLETED: "bg-primary-light/10 text-primary-light border-primary-light/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusIcons: Record<string, React.ElementType> = {
  CONFIRMED: Clock,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
};

interface Props {
  activities: Array<{ id: string; title: string }>;
}

export function BookingsManagementClient({ activities }: Props) {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [activityFilter, setActivityFilter] = useState<string>("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (activityFilter) params.set("activityId", activityFilter);

    const res = await fetch(`/api/operator/bookings?${params}`);
    if (res.ok) {
      const data = await res.json();
      setBookings(data.bookings);
    }
    setLoading(false);
  }, [statusFilter, activityFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id: string, status: "COMPLETED" | "CANCELLED") => {
    setUpdating(id);
    const res = await fetch(`/api/operator/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    }
    setUpdating(null);
  };

  // Summary stats
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;
  const totalRevenue = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((s, b) => s + b.totalPrice, 0);
  const totalPax = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((s, b) => s + b.participants, 0);

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
          <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
            Booking Management
          </h1>
          <p className="mt-1 text-sm text-white/40">
            View and manage all bookings for your activities
          </p>
        </motion.div>

        {/* Summary cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          <motion.div
            variants={fadeInUp}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <p className="text-xs text-white/30">Pending</p>
            <p className="mt-1 text-2xl font-bold text-amber-400">{confirmed}</p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <p className="text-xs text-white/30">Completed</p>
            <p className="mt-1 text-2xl font-bold text-emerald-400">
              {completed}
            </p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <p className="text-xs text-white/30">Total Revenue</p>
            <p className="mt-1 text-2xl font-bold text-white">
              €{totalRevenue.toLocaleString()}
            </p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <p className="text-xs text-white/30">Total Guests</p>
            <p className="mt-1 text-2xl font-bold text-primary-light">
              {totalPax}
            </p>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-accent/30 focus:outline-none"
          >
            <option value="" className="bg-[#1a1a2e]">
              All Statuses
            </option>
            <option value="CONFIRMED" className="bg-[#1a1a2e]">
              Confirmed
            </option>
            <option value="COMPLETED" className="bg-[#1a1a2e]">
              Completed
            </option>
            <option value="CANCELLED" className="bg-[#1a1a2e]">
              Cancelled
            </option>
          </select>
          <select
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
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

        {/* Booking list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-white/20" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-16 text-center">
            <CalendarDays className="mb-3 h-8 w-8 text-white/15" />
            <p className="text-sm text-white/40">No bookings found</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {bookings.map((booking) => {
              const StatusIcon = statusIcons[booking.status] || Clock;
              const slotDate = booking.timeSlot
                ? new Date(booking.timeSlot.date)
                : null;

              return (
                <motion.div
                  key={booking.id}
                  variants={fadeInUp}
                  className="glass-card overflow-hidden transition-all duration-300 hover:border-white/[0.12]"
                >
                  <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
                    {/* Booking info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/activities/${booking.activity.slug}`}
                          className="truncate text-sm font-semibold text-white hover:text-accent transition-colors"
                        >
                          {booking.activity.title}
                        </Link>
                        <span
                          className={cn(
                            "flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                            statusColors[booking.status]
                          )}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {booking.status.toLowerCase()}
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {booking.user.name} · {booking.participants} pax
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {booking.user.email}
                        </span>
                        {slotDate && (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {slotDate.toLocaleDateString("en", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            at {booking.timeSlot!.startTime}
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-medium text-white/60">
                          <DollarSign className="h-3 w-3" />€
                          {booking.totalPrice}
                        </span>
                      </div>
                      {booking.notes && (
                        <div className="mt-2 flex items-start gap-1.5 text-xs text-white/30">
                          <FileText className="mt-0.5 h-3 w-3 shrink-0" />
                          <span className="line-clamp-1">{booking.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {booking.status === "CONFIRMED" && (
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() =>
                            updateStatus(booking.id, "COMPLETED")
                          }
                          disabled={updating === booking.id}
                          className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 transition-all hover:bg-emerald-500/20"
                        >
                          {updating === booking.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          )}
                          Complete
                        </button>
                        <button
                          onClick={() =>
                            updateStatus(booking.id, "CANCELLED")
                          }
                          disabled={updating === booking.id}
                          className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Cancel
                        </button>
                      </div>
                    )}

                    {booking.status === "COMPLETED" && (
                      <div className="shrink-0 rounded-lg border border-primary-light/10 bg-primary-light/5 px-3 py-2 text-xs text-primary-light">
                        Completed
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
