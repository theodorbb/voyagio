"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Users,
  MapPin,
  XCircle,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Compass,
  Star,
  Pen,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { ReviewModal } from "@/components/reviews/review-modal";

interface BookingItem {
  id: string;
  participants: number;
  totalPrice: number;
  status: string;
  notes: string | null;
  createdAt: string;
  activity: {
    title: string;
    slug: string;
    price: number;
    currency: string;
    duration: number;
    category: string;
    coverImage: string;
    destination: { name: string; slug: string; country: string };
    operatorName: string;
  };
  timeSlot: {
    date: string;
    startTime: string;
    endTime: string;
  } | null;
  review: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  CONFIRMED: {
    label: "Confirmed",
    color: "text-green-400 border-green-500/20 bg-green-500/10",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  COMPLETED: {
    label: "Completed",
    color: "text-blue-400 border-blue-500/20 bg-blue-500/10",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-400 border-red-500/20 bg-red-500/10",
    icon: <XCircle className="h-3 w-3" />,
  },
};

const FILTER_TABS = ["All", "Confirmed", "Completed", "Cancelled"] as const;

export function MyBookingsClient({ bookings }: { bookings: BookingItem[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("All");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reviewTarget, setReviewTarget] = useState<{
    bookingId: string;
    activityTitle: string;
    existingReview: BookingItem["review"];
  } | null>(null);

  const filtered =
    filter === "All"
      ? bookings
      : bookings.filter((b) => b.status === filter.toUpperCase());

  async function handleCancel(id: string) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "PATCH" });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="section-container max-w-4xl">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <Link
            href="/dashboard/tourist"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <h1 className="font-display text-3xl font-bold text-white">
            My <span className="gradient-text">Bookings</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-6 flex gap-2 overflow-x-auto"
        >
          {FILTER_TABS.map((tab) => {
            const count =
              tab === "All"
                ? bookings.length
                : bookings.filter((b) => b.status === tab.toUpperCase()).length;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                  filter === tab
                    ? "border-accent/40 bg-accent/15 text-accent"
                    : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/[0.12] hover:text-white/60"
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </motion.div>

        {/* Booking list */}
        {filtered.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center py-20 text-center"
          >
            <CalendarDays className="mb-4 h-10 w-10 text-white/10" />
            <h3 className="text-lg font-semibold text-white/50">
              No bookings found
            </h3>
            <p className="mt-1 text-sm text-white/25">
              {filter === "All"
                ? "Start exploring activities to make your first booking"
                : `No ${filter.toLowerCase()} bookings`}
            </p>
            {filter === "All" && (
              <Link
                href="/activities"
                className="btn-primary mt-6 !rounded-xl !px-6"
              >
                <Compass className="h-4 w-4" />
                Explore Activities
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filtered.map((booking) => {
              const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.CONFIRMED;
              const act = booking.activity;
              const dateStr = booking.timeSlot
                ? new Date(booking.timeSlot.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                : "";

              return (
                <motion.div
                  key={booking.id}
                  variants={fadeInUp}
                  className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all hover:border-white/[0.12]"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-48">
                      <Image
                        src={act.coverImage}
                        alt={act.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 192px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--background)]/80 hidden sm:block" />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background)]/80 sm:hidden" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <span className="rounded-full border border-accent/30 bg-accent/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                            {act.category}
                          </span>
                          <span
                            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${status.color}`}
                          >
                            {status.icon}
                            {status.label}
                          </span>
                          {booking.review && (
                            <span className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-400">
                              <Star className="h-2.5 w-2.5 fill-amber-400" />
                              {booking.review.rating}/5 Reviewed
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/activities/${act.slug}`}
                          className="font-display text-lg font-bold text-white transition-colors hover:text-accent"
                        >
                          {act.title}
                        </Link>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-white/30">
                          <MapPin className="h-3 w-3" />
                          {act.destination.name}, {act.destination.country}
                        </div>

                        {/* Details row */}
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/40">
                          {booking.timeSlot && (
                            <>
                              <div className="flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {dateStr}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {booking.timeSlot.startTime} – {booking.timeSlot.endTime}
                              </div>
                            </>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            {booking.participants}{" "}
                            {booking.participants === 1 ? "person" : "people"}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-3">
                        <div>
                          <p className="font-display text-lg font-bold text-white">
                            {act.currency}
                            {booking.totalPrice}
                          </p>
                          <p className="text-[10px] text-white/20">
                            Booked{" "}
                            {new Date(booking.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/activities/${act.slug}`}
                            className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-2 text-[11px] font-medium text-white/50 transition-all hover:border-white/[0.15] hover:text-white"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View
                          </Link>
                          {booking.status === "COMPLETED" && !booking.review && (
                            <button
                              onClick={() =>
                                setReviewTarget({
                                  bookingId: booking.id,
                                  activityTitle: act.title,
                                  existingReview: null,
                                })
                              }
                              className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[11px] font-medium text-amber-400 transition-all hover:bg-amber-500/10"
                            >
                              <Star className="h-3 w-3" />
                              Leave Review
                            </button>
                          )}
                          {booking.status === "COMPLETED" && booking.review && (
                            <button
                              onClick={() =>
                                setReviewTarget({
                                  bookingId: booking.id,
                                  activityTitle: act.title,
                                  existingReview: booking.review,
                                })
                              }
                              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[11px] font-medium text-emerald-400 transition-all hover:bg-emerald-500/10"
                            >
                              <Pen className="h-3 w-3" />
                              Edit Review
                            </button>
                          )}
                          {booking.status === "CONFIRMED" && (
                            <button
                              onClick={() => handleCancel(booking.id)}
                              disabled={cancellingId === booking.id}
                              className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-[11px] font-medium text-red-400 transition-all hover:bg-red-500/10 disabled:opacity-50"
                            >
                              {cancellingId === booking.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Review Modal */}
        {reviewTarget && (
          <ReviewModal
            isOpen={!!reviewTarget}
            onClose={() => setReviewTarget(null)}
            bookingId={reviewTarget.bookingId}
            activityTitle={reviewTarget.activityTitle}
            existingReview={reviewTarget.existingReview}
            onSuccess={() => router.refresh()}
          />
        )}
      </div>
    </div>
  );
}
