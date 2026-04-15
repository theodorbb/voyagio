"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  MapPin,
  MessageSquare,
  Pen,
  ExternalLink,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { ReviewModal } from "@/components/reviews/review-modal";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  activity: {
    title: string;
    slug: string;
    coverImage: string;
    category: string;
    destinationName: string;
  };
  bookingId: string | null;
}

export function MyReviewsClient({ reviews }: { reviews: ReviewItem[] }) {
  const router = useRouter();
  const [editTarget, setEditTarget] = useState<{
    bookingId: string;
    activityTitle: string;
    existingReview: { id: string; rating: number; comment: string | null };
  } | null>(null);

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
            My <span className="gradient-text">Reviews</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""} submitted
          </p>
        </motion.div>

        {reviews.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center py-20 text-center"
          >
            <MessageSquare className="mb-4 h-10 w-10 text-white/10" />
            <h3 className="text-lg font-semibold text-white/50">
              No reviews yet
            </h3>
            <p className="mt-1 text-sm text-white/25">
              Complete a booking to share your experience
            </p>
            <Link
              href="/dashboard/tourist/bookings"
              className="btn-primary mt-6 !rounded-xl !px-6"
            >
              View My Bookings
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                variants={fadeInUp}
                className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all hover:border-white/[0.12]"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative h-36 w-full shrink-0 sm:h-auto sm:w-40">
                    <Image
                      src={review.activity.coverImage}
                      alt={review.activity.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 160px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--background)]/80 hidden sm:block" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full border border-accent/30 bg-accent/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                          {review.activity.category}
                        </span>
                        <span className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-400">
                          <Star className="h-2.5 w-2.5 fill-amber-400" />
                          {review.rating}/5
                        </span>
                      </div>

                      <Link
                        href={`/activities/${review.activity.slug}`}
                        className="font-display text-lg font-bold text-white transition-colors hover:text-accent"
                      >
                        {review.activity.title}
                      </Link>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-white/30">
                        <MapPin className="h-3 w-3" />
                        {review.activity.destinationName}
                      </div>

                      {review.comment && (
                        <p className="mt-3 text-sm leading-relaxed text-white/50">
                          &ldquo;{review.comment}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-3">
                      <p className="text-[10px] text-white/20">
                        Reviewed{" "}
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/activities/${review.activity.slug}`}
                          className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-2 text-[11px] font-medium text-white/50 transition-all hover:border-white/[0.15] hover:text-white"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Activity
                        </Link>
                        {review.bookingId && (
                          <button
                            onClick={() =>
                              setEditTarget({
                                bookingId: review.bookingId!,
                                activityTitle: review.activity.title,
                                existingReview: {
                                  id: review.id,
                                  rating: review.rating,
                                  comment: review.comment,
                                },
                              })
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[11px] font-medium text-emerald-400 transition-all hover:bg-emerald-500/10"
                          >
                            <Pen className="h-3 w-3" />
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Edit Modal */}
        {editTarget && (
          <ReviewModal
            isOpen={!!editTarget}
            onClose={() => setEditTarget(null)}
            bookingId={editTarget.bookingId}
            activityTitle={editTarget.activityTitle}
            existingReview={editTarget.existingReview}
            onSuccess={() => router.refresh()}
          />
        )}
      </div>
    </div>
  );
}
