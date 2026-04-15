"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Star,
  Users,
  CheckCircle2,
  Sparkles,
  Shield,
} from "lucide-react";
import { fadeInUp, fadeIn, staggerContainer } from "@/lib/motion";
import { ActivityCard, FavoriteButton } from "@/components/browse";
import { BookingPanel } from "@/components/booking/booking-panel";
import { VoyagioMap } from "@/components/maps/voyagio-map";

interface ActivityData {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  duration: number;
  difficulty: string | null;
  maxGroupSize: number;
  rating: number;
  reviewCount: number;
  images: string[];
  included: string[];
  highlights: string[];
  destination: { name: string; slug: string; country: string };
  operator: { name: string; avatar: string | null; bio: string | null };
  latitude: number;
  longitude: number;
}

interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string; avatar: string | null };
}

interface RelatedActivity {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  currency: string;
  duration: number;
  rating: number;
  reviewCount: number;
  coverImage: string;
  destinationName: string;
  destinationSlug: string;
  difficulty: string | null;
  maxGroupSize: number;
}

interface Props {
  activity: ActivityData;
  reviews: ReviewData[];
  relatedActivities: RelatedActivity[];
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} minutes`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h} hours`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${
            s <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-white/10"
          }`}
        />
      ))}
    </div>
  );
}

export function ActivityDetailClient({
  activity,
  reviews,
  relatedActivities,
}: Props) {
  const initials = activity.operator.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[360px] overflow-hidden">
        <Image
          src={activity.images[0]}
          alt={activity.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/50 to-transparent" />

        {/* Back + Favorite */}
        <div className="section-container relative z-10 flex h-full flex-col justify-between pb-10 pt-28">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-between"
          >
            <Link
              href={`/destinations/${activity.destination.slug}`}
              className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {activity.destination.name}
            </Link>
            <FavoriteButton
              activityId={activity.id}
              initialFavorited={false}
              size="md"
            />
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-accent/30 bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                {activity.category}
              </span>
              <span className="text-xs text-white/40">
                {activity.destination.name}, {activity.destination.country}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              {activity.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-white">
                  {activity.rating.toFixed(1)}
                </span>
                <span className="text-white/40">
                  ({activity.reviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-white/40">
                <Clock className="h-4 w-4" />
                {formatDuration(activity.duration)}
              </div>
              <div className="flex items-center gap-1.5 text-white/40">
                <Users className="h-4 w-4" />
                Max {activity.maxGroupSize} people
              </div>
              {activity.difficulty && (
                <div className="flex items-center gap-1.5 text-white/40">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      activity.difficulty === "Easy"
                        ? "bg-green-400"
                        : activity.difficulty === "Moderate"
                          ? "bg-amber-400"
                          : "bg-red-400"
                    }`}
                  />
                  {activity.difficulty}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-container py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main content — 2 cols */}
          <div className="space-y-12 lg:col-span-2">
            {/* Description */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="mb-4 font-display text-xl font-bold text-white">
                About This Experience
              </h2>
              <p className="text-sm leading-relaxed text-white/60">
                {activity.description}
              </p>
            </motion.div>

            {/* Highlights */}
            {activity.highlights.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <h3 className="font-display text-lg font-bold text-white">
                    Highlights
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {activity.highlights.map((h) => (
                    <div
                      key={h}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-accent/70" />
                      <span className="text-sm text-white/60">{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* What's Included */}
            {activity.included.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h3 className="mb-4 font-display text-lg font-bold text-white">
                  What&apos;s Included
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {activity.included.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-white/50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400/70" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Gallery */}
            {activity.images.length > 1 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h3 className="mb-4 font-display text-lg font-bold text-white">
                  Gallery
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {activity.images.slice(1).map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.06]"
                    >
                      <Image
                        src={img}
                        alt={`${activity.title} - ${i + 2}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-white">
                  Reviews
                </h3>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-white">
                    {activity.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-white/40">
                    ({activity.reviewCount} total)
                  </span>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r) => {
                    const rInitials = r.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);
                    return (
                      <div
                        key={r.id}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/60 to-primary-light/60 text-xs font-bold text-white">
                              {rInitials}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {r.user.name}
                              </p>
                              <p className="text-[10px] text-white/30">
                                {new Date(r.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                          <StarRating rating={r.rating} />
                        </div>
                        {r.comment && (
                          <p className="text-sm leading-relaxed text-white/50">
                            &ldquo;{r.comment}&rdquo;
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-6 py-10 text-center">
                  <Star className="mx-auto mb-3 h-8 w-8 text-white/10" />
                  <p className="text-sm font-medium text-white/30">
                    No reviews yet
                  </p>
                  <p className="mt-1 text-xs text-white/15">
                    Be the first to share your experience
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking card */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="sticky top-28 space-y-6"
            >
              <BookingPanel
                activityId={activity.id}
                activityTitle={activity.title}
                price={activity.price}
                currency={activity.currency}
                maxGroupSize={activity.maxGroupSize}
              />

              {/* Activity details */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">Duration</span>
                    <span className="font-medium text-white/70">
                      {formatDuration(activity.duration)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">Group size</span>
                    <span className="font-medium text-white/70">
                      Up to {activity.maxGroupSize}
                    </span>
                  </div>
                  {activity.difficulty && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/40">Difficulty</span>
                      <span className="font-medium text-white/70">
                        {activity.difficulty}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">Category</span>
                    <span className="font-medium text-white/70">
                      {activity.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Operator info */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                <div className="mb-3 flex items-center gap-2 text-xs text-white/30">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Hosted by</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent/60 to-accent-light/60 text-sm font-bold text-white">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {activity.operator.name}
                    </p>
                    <p className="text-[10px] text-white/30">
                      Verified Operator
                    </p>
                  </div>
                </div>
                {activity.operator.bio && (
                  <p className="mt-3 text-xs leading-relaxed text-white/40">
                    {activity.operator.bio}
                  </p>
                )}
              </div>

              {/* Location map */}
              {activity.latitude && activity.longitude && (
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <div className="mb-3 flex items-center gap-2 text-xs text-white/30">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Location</span>
                  </div>
                  <VoyagioMap
                    center={[activity.latitude, activity.longitude]}
                    zoom={14}
                    height="h-[180px]"
                    markers={[
                      {
                        lat: activity.latitude,
                        lng: activity.longitude,
                        title: activity.title,
                        category: activity.category,
                      },
                    ]}
                  />
                </div>
              )}

              {/* Destination link */}
              <Link
                href={`/destinations/${activity.destination.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06]"
              >
                <MapPin className="h-5 w-5 shrink-0 text-primary-light" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {activity.destination.name}
                  </p>
                  <p className="text-xs text-white/40">
                    View all activities in {activity.destination.name} →
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Related Activities */}
        {relatedActivities.length > 0 && (
          <div className="mt-20">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="mb-2 font-display text-2xl font-bold text-white">
                More in{" "}
                <span className="gradient-text">
                  {activity.destination.name}
                </span>
              </h2>
              <p className="mb-8 text-sm text-white/40">
                Other experiences you might enjoy
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {relatedActivities.map((a, i) => (
                <ActivityCard
                  key={a.id}
                  {...a}
                  showFavorite
                  index={i}
                />
              ))}
            </motion.div>
          </div>
        )}
      </section>
    </div>
  );
}
