"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  CalendarDays,
  DollarSign,
  Star,
  MapPin,
  MessageSquare,
  Users,
  Clock,
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  Percent,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { StatCard } from "@/components/dashboard/stat-card";
import { cn } from "@/lib/utils";

interface OperatorDashboardClientProps {
  user: { name: string; email: string };
  stats: {
    totalActivities: number;
    activeActivities: number;
    totalBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    revenue: number;
    pendingRevenue: number;
    avgRating: number;
    totalReviews: number;
    upcomingSlots: number;
    utilization: number;
  };
  activities: Array<{
    id: string;
    title: string;
    status: string;
    price: number;
    rating: number;
    reviewCount: number;
    destination: { name: string };
  }>;
  recentBookings: Array<{
    id: string;
    status: string;
    totalPrice: number;
    participants: number;
    createdAt: string;
    activity: { title: string; slug: string };
    user: { name: string };
    timeSlot: { date: string; startTime: string } | null;
  }>;
  recentReviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    user: { name: string };
    activity: { title: string };
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    avgRating: number;
  }>;
}

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  COMPLETED: "bg-primary-light/10 text-primary-light border-primary-light/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
  ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  DRAFT: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const statusIcons: Record<string, React.ElementType> = {
  CONFIRMED: Clock,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
};

const NAV_LINKS = [
  {
    href: "/dashboard/operator/activities",
    label: "Activities",
    desc: "Manage your experiences",
    icon: Activity,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    href: "/dashboard/operator/bookings",
    label: "Bookings",
    desc: "View & manage reservations",
    icon: CalendarDays,
    color: "text-primary-light",
    bg: "bg-primary-light/10",
  },
  {
    href: "/dashboard/operator/schedule",
    label: "Schedule",
    desc: "Time slots & availability",
    icon: Clock,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
];

export function OperatorDashboardClient({
  user,
  stats,
  activities,
  recentBookings,
  recentReviews,
  categoryBreakdown,
}: OperatorDashboardClientProps) {
  const firstName = user.name.split(" ")[0];

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
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            Operator Dashboard
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white md:text-4xl">
            Hello, <span className="gradient-text">{firstName}</span>
          </h1>
          <p className="mt-2 text-white/50">
            Manage your experiences and track performance
          </p>
        </motion.div>

        {/* Quick Nav */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-8 grid grid-cols-3 gap-3"
        >
          {NAV_LINKS.map((link) => (
            <motion.div key={link.href} variants={fadeInUp}>
              <Link
                href={link.href}
                className="glass-card-hover flex items-center gap-3 p-4 transition-colors"
              >
                <div className={cn("rounded-lg p-2.5", link.bg)}>
                  <link.icon className={cn("h-5 w-5", link.color)} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">
                    {link.label}
                  </p>
                  <p className="truncate text-[10px] text-white/30">
                    {link.desc}
                  </p>
                </div>
                <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-white/15" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* KPI Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          <StatCard
            label="Activities"
            value={stats.totalActivities}
            subtitle={`${stats.activeActivities} active`}
            icon={Activity}
            color="accent"
          />
          <StatCard
            label="Total Bookings"
            value={stats.totalBookings}
            subtitle={`${stats.confirmedBookings} pending`}
            icon={CalendarDays}
            color="primary"
          />
          <StatCard
            label="Revenue"
            value={`€${stats.revenue.toLocaleString()}`}
            subtitle={
              stats.pendingRevenue > 0
                ? `€${stats.pendingRevenue.toLocaleString()} pending`
                : "from completed bookings"
            }
            icon={DollarSign}
            color="green"
          />
          <StatCard
            label="Avg Rating"
            value={stats.avgRating || "—"}
            subtitle={`${stats.totalReviews} reviews`}
            icon={Star}
            color="purple"
          />
        </motion.div>

        {/* Secondary KPIs */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-10 grid grid-cols-3 gap-3"
        >
          <motion.div
            variants={fadeInUp}
            className="glass-card flex items-center gap-3 p-4"
          >
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <Percent className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {stats.utilization}%
              </p>
              <p className="text-[10px] text-white/30">Slot utilization</p>
            </div>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="glass-card flex items-center gap-3 p-4"
          >
            <div className="rounded-lg bg-primary-light/10 p-2">
              <TrendingUp className="h-4 w-4 text-primary-light" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {stats.upcomingSlots}
              </p>
              <p className="text-[10px] text-white/30">Upcoming slots</p>
            </div>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="glass-card flex items-center gap-3 p-4"
          >
            <div className="rounded-lg bg-amber-500/10 p-2">
              <BarChart3 className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {stats.totalBookings > 0
                  ? Math.round(
                      ((stats.totalBookings - stats.cancelledBookings) /
                        stats.totalBookings) *
                        100
                    )
                  : 0}
                %
              </p>
              <p className="text-[10px] text-white/30">Conversion rate</p>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Bookings — wider */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="glass-card p-6 lg:col-span-2"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-white">
                Recent Bookings
              </h2>
              <Link
                href="/dashboard/operator/bookings"
                className="flex items-center gap-1 text-xs text-accent hover:text-accent/80"
              >
                View All
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-2">
              {recentBookings.map((booking) => {
                const StatusIcon = statusIcons[booking.status] || Clock;
                const slotDate = booking.timeSlot
                  ? new Date(booking.timeSlot.date)
                  : null;
                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {booking.activity.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-white/40">
                        <Users className="h-3 w-3" />
                        {booking.user.name}
                        <span>·</span>
                        <span>{booking.participants} pax</span>
                        <span>·</span>
                        <span>€{booking.totalPrice}</span>
                        {slotDate && (
                          <>
                            <span>·</span>
                            <span>
                              {slotDate.toLocaleDateString("en", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        statusColors[booking.status] || "text-white/40"
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {booking.status.toLowerCase()}
                    </span>
                  </div>
                );
              })}
              {recentBookings.length === 0 && (
                <p className="py-8 text-center text-sm text-white/20">
                  No bookings yet
                </p>
              )}
            </div>
          </motion.div>

          {/* Sidebar: Category breakdown + Activities */}
          <div className="space-y-6">
            {/* Category Breakdown */}
            {categoryBreakdown.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="glass-card p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-sm font-semibold text-white">
                    Activity Categories
                  </h2>
                  <BarChart3 className="h-4 w-4 text-white/20" />
                </div>
                <div className="space-y-3">
                  {categoryBreakdown.map((cat) => (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-white/60">
                          {cat.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-white/30">
                            {cat.count} activit
                            {cat.count !== 1 ? "ies" : "y"}
                          </span>
                          {cat.avgRating > 0 && (
                            <span className="flex items-center gap-0.5 text-amber-400">
                              <Star className="h-3 w-3 fill-amber-400" />
                              {cat.avgRating}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accent/60 to-primary-light/60"
                          style={{
                            width: `${Math.min(
                              100,
                              (cat.count /
                                Math.max(
                                  ...categoryBreakdown.map((c) => c.count)
                                )) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Activities */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="glass-card p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-sm font-semibold text-white">
                  Your Activities
                </h2>
                <Link
                  href="/dashboard/operator/activities"
                  className="flex items-center gap-1 text-xs text-accent hover:text-accent/80"
                >
                  Manage
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="space-y-2">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-white">
                        {act.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-white/30">
                        <MapPin className="h-2.5 w-2.5" />
                        {act.destination.name}
                        <span>·</span>
                        <span>€{act.price}</span>
                        {act.reviewCount > 0 && (
                          <>
                            <span>·</span>
                            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                            {act.rating}
                          </>
                        )}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        statusColors[act.status] || "text-white/30"
                      )}
                    >
                      {act.status.toLowerCase()}
                    </span>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="py-4 text-center text-xs text-white/20">
                    No activities yet
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Reviews */}
        {recentReviews.length > 0 && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mt-6 glass-card p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-white">
                Latest Reviews
              </h2>
              <MessageSquare className="h-4 w-4 text-white/30" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <div className="mb-2 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-white/10"
                        )}
                      />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-sm text-white/60 line-clamp-2">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  )}
                  <div className="mt-2 text-xs text-white/30">
                    <span className="text-white/50">{review.user.name}</span>
                    {" on "}
                    {review.activity.title}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Booking Status Breakdown */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mt-6 glass-card p-6"
        >
          <h2 className="mb-4 font-display text-lg font-semibold text-white">
            Booking Overview
          </h2>
          <div className="flex items-center gap-3">
            {/* Visual bar */}
            <div className="flex-1">
              <div className="flex h-3 overflow-hidden rounded-full">
                {stats.completedBookings > 0 && (
                  <div
                    className="bg-primary-light transition-all"
                    style={{
                      width: `${
                        (stats.completedBookings / Math.max(stats.totalBookings, 1)) *
                        100
                      }%`,
                    }}
                    title={`${stats.completedBookings} completed`}
                  />
                )}
                {stats.confirmedBookings > 0 && (
                  <div
                    className="bg-emerald-400 transition-all"
                    style={{
                      width: `${
                        (stats.confirmedBookings / Math.max(stats.totalBookings, 1)) *
                        100
                      }%`,
                    }}
                    title={`${stats.confirmedBookings} confirmed`}
                  />
                )}
                {stats.cancelledBookings > 0 && (
                  <div
                    className="bg-red-400/50 transition-all"
                    style={{
                      width: `${
                        (stats.cancelledBookings / Math.max(stats.totalBookings, 1)) *
                        100
                      }%`,
                    }}
                    title={`${stats.cancelledBookings} cancelled`}
                  />
                )}
                {stats.totalBookings === 0 && (
                  <div className="w-full bg-white/[0.06]" />
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-6 text-xs">
            <span className="flex items-center gap-1.5 text-primary-light">
              <span className="h-2 w-2 rounded-full bg-primary-light" />
              Completed ({stats.completedBookings})
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Confirmed ({stats.confirmedBookings})
            </span>
            <span className="flex items-center gap-1.5 text-red-400/70">
              <span className="h-2 w-2 rounded-full bg-red-400/50" />
              Cancelled ({stats.cancelledBookings})
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
