"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  CalendarDays,
  Clock,
  Users,
  MapPin,
  ArrowRight,
  Compass,
  Home,
  User,
} from "lucide-react";
import { fadeInUp, fadeIn } from "@/lib/motion";

interface BookingData {
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
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} minutes`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h} hours`;
}

export function ConfirmationClient({ booking }: { booking: BookingData }) {
  const act = booking.activity;
  const dateStr = booking.timeSlot
    ? new Date(booking.timeSlot.date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="section-container max-w-2xl">
        {/* Success icon */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/20">
            <CheckCircle2 className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            Booking Confirmed!
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Your adventure has been booked successfully
          </p>
          <p className="mt-1 text-xs text-white/25">
            Confirmation #{booking.id.slice(0, 8).toUpperCase()}
          </p>
        </motion.div>

        {/* Booking card */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]"
        >
          {/* Activity cover */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={act.coverImage}
              alt={act.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 640px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <span className="mb-1 inline-block rounded-full border border-accent/30 bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                {act.category}
              </span>
              <h2 className="font-display text-xl font-bold text-white">
                {act.title}
              </h2>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-white/40">
                <MapPin className="h-3 w-3" />
                {act.destination.name}, {act.destination.country}
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <CalendarDays className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  Date
                </p>
                <p className="text-sm font-medium text-white">{dateStr}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Clock className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  Time
                </p>
                <p className="text-sm font-medium text-white">
                  {booking.timeSlot?.startTime} – {booking.timeSlot?.endTime}
                </p>
                <p className="text-[10px] text-white/30">
                  {formatDuration(act.duration)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Users className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  Participants
                </p>
                <p className="text-sm font-medium text-white">
                  {booking.participants}{" "}
                  {booking.participants === 1 ? "person" : "people"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <User className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  Hosted by
                </p>
                <p className="text-sm font-medium text-white">
                  {act.operatorName}
                </p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mx-5 mb-5 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div>
              <p className="text-xs text-white/30">
                {act.currency}
                {act.price} × {booking.participants}{" "}
                {booking.participants === 1 ? "person" : "people"}
              </p>
              <p className="text-[10px] text-white/20">
                {booking.status === "CONFIRMED" && "Free cancellation available"}
              </p>
            </div>
            <p className="font-display text-2xl font-bold text-white">
              {act.currency}
              {booking.totalPrice}
            </p>
          </div>

          {booking.notes && (
            <div className="mx-5 mb-5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">
                Special Requests
              </p>
              <p className="text-sm text-white/60">{booking.notes}</p>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mt-8 grid gap-3 sm:grid-cols-3"
        >
          <Link
            href="/dashboard/tourist/bookings"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/60 transition-all hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
          >
            <CalendarDays className="h-4 w-4" />
            My Bookings
          </Link>
          <Link
            href="/activities"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/60 transition-all hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
          >
            <Compass className="h-4 w-4" />
            Explore More
          </Link>
          <Link
            href="/dashboard/tourist"
            className="btn-primary flex items-center justify-center gap-2 !rounded-xl !py-3"
          >
            <Home className="h-4 w-4" />
            Dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
