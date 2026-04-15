"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  X,
  Loader2,
  CheckCircle2,
  Pen,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Interactive Star Rating ────────────────
export function StarRatingInput({
  value,
  onChange,
  size = "lg",
}: {
  value: number;
  onChange: (v: number) => void;
  size?: "sm" | "lg";
}) {
  const [hover, setHover] = useState(0);
  const iconSize = size === "lg" ? "h-8 w-8" : "h-5 w-5";

  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            className="rounded-lg p-1 transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              className={cn(
                iconSize,
                "transition-colors duration-150",
                s <= (hover || value)
                  ? "fill-amber-400 text-amber-400"
                  : "text-white/15 hover:text-white/25"
              )}
            />
          </button>
        ))}
      </div>
      {(hover || value) > 0 && (
        <p className="text-xs font-medium text-amber-400/80">
          {labels[hover || value]}
        </p>
      )}
    </div>
  );
}

// ─── Review Modal ───────────────────────────
interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  activityTitle: string;
  // For editing
  existingReview?: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
  onSuccess: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  bookingId,
  activityTitle,
  existingReview,
  onSuccess,
}: ReviewModalProps) {
  const isEditing = !!existingReview;
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = isEditing
        ? `/api/reviews/${existingReview!.id}`
        : "/api/reviews";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isEditing ? {} : { bookingId }),
          rating,
          comment: comment.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={!loading ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[var(--surface-dark)] p-8 shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-white/30 transition-colors hover:text-white/60 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>

            {success ? (
              /* Success state */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <div className="mb-4 rounded-full bg-emerald-500/10 p-4">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  {isEditing ? "Review Updated!" : "Review Submitted!"}
                </h3>
                <p className="mt-2 text-sm text-white/40">
                  Thank you for sharing your experience
                </p>
              </motion.div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit}>
                <div className="mb-6 flex items-center gap-2">
                  <Pen className="h-4 w-4 text-accent" />
                  <h2 className="font-display text-lg font-bold text-white">
                    {isEditing ? "Edit Your Review" : "Rate Your Experience"}
                  </h2>
                </div>

                <p className="mb-6 text-sm text-white/40">
                  How was <span className="font-medium text-white/60">{activityTitle}</span>?
                </p>

                {/* Star rating */}
                <div className="mb-8 flex justify-center">
                  <StarRatingInput value={rating} onChange={setRating} />
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <label className="mb-2 block text-xs font-medium text-white/40">
                    Share your thoughts (optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What made this experience special?"
                    rows={4}
                    maxLength={2000}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 transition-colors focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
                  />
                  <p className="mt-1 text-right text-[10px] text-white/20">
                    {comment.length}/2000
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <p className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs text-red-400">
                    {error}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="rounded-xl border border-white/[0.08] px-5 py-2.5 text-sm font-medium text-white/50 transition-colors hover:text-white disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || rating === 0}
                    className="btn-primary !rounded-xl !px-6 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isEditing ? (
                      "Update Review"
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
