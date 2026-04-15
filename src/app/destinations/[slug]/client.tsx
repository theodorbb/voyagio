"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Sparkles,
  ArrowLeft,
  Map,
  Activity as ActivityIcon,
} from "lucide-react";
import { fadeInUp, fadeIn, staggerContainer } from "@/lib/motion";
import { ActivityCard, SearchBar, FilterChip, EmptyState } from "@/components/browse";
import { VoyagioMap } from "@/components/maps/voyagio-map";

interface DestinationData {
  id: string;
  name: string;
  slug: string;
  country: string;
  description: string;
  coverImage: string;
  highlights: string[];
  avgRating: number;
  totalReviews: number;
  activityCount: number;
  latitude: number;
  longitude: number;
}

interface ActivityData {
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
  featured: boolean;
  latitude: number;
  longitude: number;
}

interface Props {
  destination: DestinationData;
  activities: ActivityData[];
  categories: string[];
}

export function DestinationDetailClient({
  destination,
  activities,
  categories,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);  const router = useRouter();
  const filtered = useMemo(() => {
    let result = activities;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      result = result.filter((a) => a.category === selectedCategory);
    }
    return result;
  }, [activities, search, selectedCategory]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src={destination.coverImage}
          alt={destination.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)]/40 to-transparent" />

        {/* Back button */}
        <div className="section-container relative z-10 flex h-full flex-col justify-end pb-10 pt-28">
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Link
              href="/destinations"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              All Destinations
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <div className="mb-3 flex items-center gap-2 text-sm text-white/50">
              <MapPin className="h-4 w-4" />
              <span>{destination.country}</span>
            </div>

            <h1 className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              {destination.name}
            </h1>

            {/* Stats row */}
            <div className="mt-4 flex flex-wrap items-center gap-5 text-sm">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-white">
                  {destination.avgRating}
                </span>
                <span className="text-white/40">
                  ({destination.totalReviews} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-white/40">
                <ActivityIcon className="h-4 w-4" />
                <span>
                  {destination.activityCount} activities
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-white/40">
                <Map className="h-4 w-4" />
                <span>{destination.country}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-container py-12">
        {/* Description + Highlights */}
        <div className="grid gap-10 lg:grid-cols-3">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <h2 className="mb-4 font-display text-xl font-bold text-white">
              About {destination.name}
            </h2>
            <p className="text-sm leading-relaxed text-white/60">
              {destination.description}
            </p>
          </motion.div>

          {destination.highlights.length > 0 && (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <h3 className="font-display text-sm font-semibold text-white">
                  Highlights
                </h3>
              </div>
              <ul className="space-y-2">
                {destination.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-center gap-2 text-sm text-white/50"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                    {h}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Activities section */}
        <div className="mt-16">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="mb-2 font-display text-2xl font-bold text-white">
              Things to Do in{" "}
              <span className="gradient-text">{destination.name}</span>
            </h2>
            <p className="mb-6 text-sm text-white/40">
              Discover {activities.length} curated experiences
            </p>
          </motion.div>

          {/* Search & category filters */}
          <div className="mb-8 space-y-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder={`Search activities in ${destination.name}...`}
              className="max-w-md"
            />
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  label="All"
                  active={!selectedCategory}
                  onClick={() => setSelectedCategory(null)}
                />
                {categories.map((c) => (
                  <FilterChip
                    key={c}
                    label={c}
                    active={selectedCategory === c}
                    onClick={() =>
                      setSelectedCategory(selectedCategory === c ? null : c)
                    }
                    count={activities.filter((a) => a.category === c).length}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <EmptyState
              title="No activities found"
              description="Try a different search or category."
              action={
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory(null);
                  }}
                  className="btn-secondary text-sm"
                >
                  Clear Filters
                </button>
              }
            />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((a, i) => (
                <ActivityCard
                  key={a.id}
                  {...a}
                  showFavorite
                  index={i}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Map section */}
        {activities.some((a) => a.latitude && a.longitude) && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="mb-4 flex items-center gap-2">
              <Map className="h-5 w-5 text-accent" />
              <h2 className="font-display text-xl font-bold text-white">
                Explore on Map
              </h2>
            </div>
            <p className="mb-4 text-sm text-white/40">
              See where all {activities.length} activities are located
            </p>
            <VoyagioMap
              center={[destination.latitude, destination.longitude]}
              zoom={12}
              height="h-[360px]"
              markers={activities
                .filter((a) => a.latitude && a.longitude)
                .map((a) => ({
                  lat: a.latitude,
                  lng: a.longitude,
                  title: a.title,
                  category: a.category,
                  price: a.price,
                  currency: a.currency,
                  slug: a.slug,
                }))}
              onMarkerClick={(m) => {
                if (m.slug) router.push(`/activities/${m.slug}`);
              }}
            />
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 px-8 py-12 text-center"
        >
          <h3 className="font-display text-xl font-bold text-white md:text-2xl">
            Ready to explore {destination.name}?
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/50">
            Start planning your trip with our smart itinerary builder. Combine
            your favorite activities into the perfect travel plan.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="btn-primary">
              Start Planning
            </Link>
            <Link href="/activities" className="btn-secondary">
              Browse All Activities
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
