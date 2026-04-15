"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Heart,
  MapPin,
  Plane,
  Clock,
  ArrowRight,
  Sparkles,
  Star,
  MessageSquare,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { StatCard } from "@/components/dashboard/stat-card";
import { cn } from "@/lib/utils";

interface TouristDashboardClientProps {
  user: { name: string; email: string; role: string };
  stats: {
    totalBookings: number;
    upcomingBookings: number;
    totalFavorites: number;
    totalTrips: number;
    totalReviews: number;
  };
  recentBookings: Array<{
    id: string;
    status: string;
    totalPrice: number;
    participants: number;
    activity: { title: string; destination: { name: string } };
    timeSlot: { date: string; startTime: string };  }>;
  favorites: Array<{
    id: string;
    activity: {
      title: string;
      price: number;
      rating: number;
      category: string;
      destination: { name: string };
    };
  }>;
  trips: Array<{
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
    destination: { name: string } | null;
    activities: Array<{ id: string }>;
  }>;
  hasPreferences: boolean;
}

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  COMPLETED: "bg-primary-light/10 text-primary-light border-primary-light/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
  PLANNING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export function TouristDashboardClient({
  user,
  stats,
  recentBookings,
  favorites,
  trips,
  hasPreferences,
}: TouristDashboardClientProps) {
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
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
            Welcome back, <span className="gradient-text">{firstName}</span>
          </h1>
          <p className="mt-2 text-white/50">
            Here&apos;s your travel overview
          </p>
        </motion.div>

        {/* Onboarding CTA */}
        {!hasPreferences && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <Link
              href="/onboarding"
              className="group flex items-center justify-between rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/10 to-accent-light/5 p-6 transition-all duration-300 hover:border-accent/30 hover:from-accent/15"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-accent/20 p-3">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">
                    Personalize your experience
                  </h3>
                  <p className="text-sm text-white/50">
                    Tell us your travel style and interests for better recommendations
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-5"
        >
          <StatCard
            label="Total Bookings"
            value={stats.totalBookings}
            icon={CalendarDays}
            color="accent"
          />
          <StatCard
            label="Upcoming"
            value={stats.upcomingBookings}
            subtitle="confirmed"
            icon={Clock}
            color="green"
          />
          <StatCard
            label="Favorites"
            value={stats.totalFavorites}
            icon={Heart}
            color="primary"
          />
          <StatCard
            label="Trips Planned"
            value={stats.totalTrips}
            icon={Plane}
            color="purple"
          />
          <StatCard
            label="Reviews"
            value={stats.totalReviews}
            icon={Star}
            color="accent"
          />
        </motion.div>

        {/* Quick Nav */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <Link
            href="/dashboard/tourist/bookings"
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
          >
            <CalendarDays className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-white/60">My Bookings</span>
          </Link>
          <Link
            href="/dashboard/tourist/reviews"
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
          >
            <MessageSquare className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-white/60">My Reviews</span>
          </Link>
          <Link
            href="/dashboard/trip-builder"
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
          >
            <Plane className="h-4 w-4 text-primary-light" />
            <span className="text-sm font-medium text-white/60">Trip Builder</span>
          </Link>
          <Link
            href="/activities"
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
          >
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-sm font-medium text-white/60">Explore</span>
          </Link>
        </motion.div>

        {/* Two columns: Bookings + Trips */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Bookings */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="glass-card p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-white">
                Recent Bookings
              </h2>
              <Link
                href="/dashboard/tourist/bookings"
                className="flex items-center gap-1 text-xs text-accent transition-colors hover:text-accent-light"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <p className="py-8 text-center text-sm text-white/30">
                No bookings yet. Start exploring activities!
              </p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href="/dashboard/tourist/bookings"
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {booking.activity.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-white/40">
                        <MapPin className="h-3 w-3" />
                        {booking.activity.destination.name}
                        <span>·</span>
                        <CalendarDays className="h-3 w-3" />
                        {new Date(booking.timeSlot.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        <span>·</span>
                        <span>{booking.timeSlot.startTime}</span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        statusColors[booking.status] || "text-white/40"
                      )}
                    >
                      {booking.status.toLowerCase()}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Trips */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="glass-card p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-white">
                Your Trips
              </h2>
              <Link
                href="/dashboard/trip-builder"
                className="flex items-center gap-1 text-xs text-accent transition-colors hover:text-accent-light"
              >
                Build a trip
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {trips.length === 0 ? (
              <div className="py-8 text-center">
                <p className="mb-3 text-sm text-white/30">
                  No trips planned yet.
                </p>
                <Link
                  href="/dashboard/trip-builder"
                  className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-medium text-accent transition-all hover:bg-accent/20"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Try the Smart Trip Builder
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {trips.map((trip) => (
                  <Link
                    key={trip.id}
                    href={`/dashboard/trips/${trip.id}`}
                    className="block rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{trip.name}</p>
                        <p className="mt-0.5 text-xs text-white/40">
                          {trip.destination?.name ?? "Multiple destinations"} ·{" "}
                          {trip.activities.length} activities
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          statusColors[trip.status] || "text-white/40"
                        )}
                      >
                        {trip.status.toLowerCase()}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-white/30">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {" → "}
                      {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mt-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-white">
                Saved Activities
              </h2>
              <Heart className="h-4 w-4 text-white/30" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="glass-card-hover p-4"
                >
                  <p className="text-sm font-medium text-white">{fav.activity.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-white/40">
                    <MapPin className="h-3 w-3" />
                    {fav.activity.destination.name}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-accent">€{fav.activity.price}</span>
                    {fav.activity.rating > 0 && (
                      <div className="flex items-center gap-1 text-xs text-white/40">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {fav.activity.rating}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
