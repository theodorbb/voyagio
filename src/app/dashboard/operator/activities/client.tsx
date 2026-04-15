"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Star,
  Clock,
  Users,
  DollarSign,
  CalendarDays,
  Archive,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ActivityStats {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  currency: string;
  duration: number;
  maxGroupSize: number;
  rating: number;
  reviewCount: number;
  status: string;
  featured: boolean;
  images: string;
  destination: { name: string; slug: string };
  createdAt: string;
  confirmedBookings: number;
  completedBookings: number;
  totalRevenue: number;
  totalBookings: number;
  totalReviews: number;
  totalSlots: number;
  upcomingSlots: number;
}

const CATEGORIES = [
  "Adventure",
  "Cultural",
  "Food & Wine",
  "Nature",
  "Water Sports",
  "Wellness",
  "Photography",
  "Nightlife",
];

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  DRAFT: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  ARCHIVED: "bg-white/5 text-white/30 border-white/10",
};

interface Props {
  destinations: Array<{ id: string; name: string; country: string }>;
}

export function ActivitiesManagementClient({ destinations }: Props) {
  const [activities, setActivities] = useState<ActivityStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    const res = await fetch("/api/operator/activities");
    if (res.ok) {
      const data = await res.json();
      setActivities(data.activities);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === "ACTIVE" ? "DRAFT" : "ACTIVE";
    setUpdating(id);
    const res = await fetch(`/api/operator/activities/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setActivities((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    }
    setUpdating(null);
  };

  const archiveActivity = async (id: string) => {
    setUpdating(id);
    const res = await fetch(`/api/operator/activities/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ARCHIVED" }),
    });
    if (res.ok) {
      setActivities((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "ARCHIVED" } : a))
      );
    }
    setUpdating(null);
  };

  const filtered = statusFilter
    ? activities.filter((a) => a.status === statusFilter)
    : activities;

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
                Activity Management
              </h1>
              <p className="mt-1 text-sm text-white/40">
                {activities.length} activities ·{" "}
                {activities.filter((a) => a.status === "ACTIVE").length} active
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              New Activity
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {[null, "ACTIVE", "DRAFT", "ARCHIVED"].map((s) => (
            <button
              key={s || "all"}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                statusFilter === s
                  ? "border-accent/30 bg-accent/10 text-accent"
                  : "border-white/[0.06] bg-white/[0.03] text-white/40 hover:text-white/60"
              )}
            >
              {s?.toLowerCase() || "all"}{" "}
              <span className="text-white/20">
                (
                {s
                  ? activities.filter((a) => a.status === s).length
                  : activities.length}
                )
              </span>
            </button>
          ))}
        </div>

        {/* Activity List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-white/20" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-white/40">No activities found</p>
            <button
              onClick={() => setShowCreate(true)}
              className="btn-primary mt-4 text-sm"
            >
              Create Your First Activity
            </button>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {filtered.map((act) => {
              const images: string[] = JSON.parse(act.images);
              return (
                <motion.div
                  key={act.id}
                  variants={fadeInUp}
                  className="glass-card overflow-hidden transition-all duration-300 hover:border-white/[0.12]"
                >
                  <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
                    {/* Image + info */}
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div
                        className="h-16 w-16 shrink-0 rounded-xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${images[0]})` }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/activities/${act.slug}`}
                            className="truncate text-sm font-semibold text-white hover:text-accent transition-colors"
                          >
                            {act.title}
                          </Link>
                          <span
                            className={cn(
                              "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                              statusColors[act.status]
                            )}
                          >
                            {act.status.toLowerCase()}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {act.destination.name}
                          </span>
                          <span>{act.category}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {act.duration}m
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Max {act.maxGroupSize}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="text-center">
                        <p className="font-semibold text-white">
                          €{act.price}
                        </p>
                        <p className="text-white/30">price</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-white">
                          {act.totalBookings}
                        </p>
                        <p className="text-white/30">bookings</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-emerald-400">
                          €{act.totalRevenue.toLocaleString()}
                        </p>
                        <p className="text-white/30">revenue</p>
                      </div>
                      {act.reviewCount > 0 && (
                        <div className="text-center">
                          <p className="flex items-center gap-1 font-semibold text-amber-400">
                            <Star className="h-3 w-3 fill-amber-400" />
                            {act.rating}
                          </p>
                          <p className="text-white/30">
                            {act.reviewCount} reviews
                          </p>
                        </div>
                      )}
                      <div className="text-center">
                        <p className="font-semibold text-primary-light">
                          {act.upcomingSlots}
                        </p>
                        <p className="text-white/30">slots</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2">
                      {act.status !== "ARCHIVED" && (
                        <button
                          onClick={() => toggleStatus(act.id, act.status)}
                          disabled={updating === act.id}
                          className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-white/60 transition-all hover:bg-white/[0.06]"
                          title={
                            act.status === "ACTIVE"
                              ? "Switch to draft"
                              : "Activate"
                          }
                        >
                          {updating === act.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : act.status === "ACTIVE" ? (
                            <ToggleRight className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="h-3.5 w-3.5" />
                          )}
                          {act.status === "ACTIVE" ? "Active" : "Activate"}
                        </button>
                      )}

                      <Link
                        href={`/dashboard/operator/schedule?activityId=${act.id}`}
                        className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-white/60 transition-all hover:bg-white/[0.06]"
                      >
                        <CalendarDays className="h-3.5 w-3.5" />
                        Slots
                      </Link>

                      {act.status !== "ARCHIVED" && (
                        <button
                          onClick={() => archiveActivity(act.id)}
                          disabled={updating === act.id}
                          className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-red-400/60 transition-all hover:bg-red-500/10"
                          title="Archive activity"
                        >
                          <Archive className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Create Activity Modal */}
        {showCreate && (
          <CreateActivityModal
            destinations={destinations}
            onClose={() => setShowCreate(false)}
            onCreated={() => {
              setShowCreate(false);
              fetchActivities();
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Create Activity Modal ──────────────────
function CreateActivityModal({
  destinations,
  onClose,
  onCreated,
}: {
  destinations: Array<{ id: string; name: string; country: string }>;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0],
    price: 50,
    duration: 120,
    maxGroupSize: 12,
    destinationId: destinations[0]?.id || "",
    difficulty: "Moderate",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/operator/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      onCreated();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create activity");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card mx-4 max-h-[85vh] w-full max-w-lg overflow-y-auto p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">
            Create New Activity
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
              Title
            </label>
            <input
              type="text"
              required
              minLength={3}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/20 focus:border-accent/30 focus:outline-none"
              placeholder="e.g., Sunset Kayak Tour"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">
              Description
            </label>
            <textarea
              required
              minLength={10}
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/20 focus:border-accent/30 focus:outline-none"
              placeholder="Describe the experience..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-accent/30 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#1a1a2e]">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">
                Destination
              </label>
              <select
                value={form.destinationId}
                onChange={(e) =>
                  setForm({ ...form, destinationId: e.target.value })
                }
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-accent/30 focus:outline-none"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#1a1a2e]">
                    {d.name}, {d.country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">
                Price (€)
              </label>
              <input
                type="number"
                required
                min={1}
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-accent/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">
                Duration (min)
              </label>
              <input
                type="number"
                required
                min={15}
                step={15}
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-accent/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/50">
                Max Group
              </label>
              <input
                type="number"
                required
                min={1}
                max={100}
                value={form.maxGroupSize}
                onChange={(e) =>
                  setForm({ ...form, maxGroupSize: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-accent/30 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">
              Difficulty
            </label>
            <select
              value={form.difficulty}
              onChange={(e) =>
                setForm({ ...form, difficulty: e.target.value })
              }
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-accent/30 focus:outline-none"
            >
              {["Easy", "Moderate", "Challenging", "Expert"].map((d) => (
                <option key={d} value={d} className="bg-[#1a1a2e]">
                  {d}
                </option>
              ))}
            </select>
          </div>

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
              Create Activity
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
