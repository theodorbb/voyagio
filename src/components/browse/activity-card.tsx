"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, MapPin, Star, Users } from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import { FavoriteButton } from "./favorite-button";

interface ActivityCardProps {
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
  difficulty?: string | null;
  maxGroupSize: number;
  isFavorited?: boolean;
  showFavorite?: boolean;
  index?: number;
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

const CATEGORY_COLORS: Record<string, string> = {
  Adventure: "text-orange-400 border-orange-400/20 bg-orange-400/10",
  Cultural: "text-blue-400 border-blue-400/20 bg-blue-400/10",
  "Food & Wine": "text-amber-400 border-amber-400/20 bg-amber-400/10",
  Nature: "text-green-400 border-green-400/20 bg-green-400/10",
  "Water Sports": "text-cyan-400 border-cyan-400/20 bg-cyan-400/10",
  Photography: "text-purple-400 border-purple-400/20 bg-purple-400/10",
  Wellness: "text-pink-400 border-pink-400/20 bg-pink-400/10",
  Nightlife: "text-rose-400 border-rose-400/20 bg-rose-400/10",
};

export function ActivityCard({
  id,
  title,
  slug,
  category,
  price,
  duration,
  rating,
  reviewCount,
  coverImage,
  destinationName,
  difficulty,
  maxGroupSize,
  isFavorited = false,
  showFavorite = false,
  index = 0,
}: ActivityCardProps) {
  const categoryStyle = CATEGORY_COLORS[category] || "text-white/40 border-white/10 bg-white/5";

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06 }}
    >
      <Link
        href={`/activities/${slug}`}
        className="group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-lg hover:shadow-primary-light/5"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />

          {/* Category */}
          <div className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${categoryStyle}`}>
            {category}
          </div>

          {/* Favorite */}
          {showFavorite && (
            <div className="absolute right-3 top-3 z-10" onClick={(e) => e.preventDefault()}>
              <FavoriteButton activityId={id} initialFavorited={isFavorited} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Destination */}
          <div className="mb-2 flex items-center gap-1.5 text-xs text-white/40">
            <MapPin className="h-3 w-3" />
            <span>{destinationName}</span>
          </div>

          <h3 className="font-display text-base font-bold text-white transition-colors group-hover:text-accent-light">
            {title}
          </h3>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(duration)}
            </span>
            {difficulty && (
              <span className="flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${difficulty === "Easy" ? "bg-green-400" : difficulty === "Moderate" ? "bg-amber-400" : "bg-red-400"}`} />
                {difficulty}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Max {maxGroupSize}
            </span>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-white">{rating.toFixed(1)}</span>
              <span className="text-xs text-white/30">({reviewCount})</span>
            </div>
            <div>
              <span className="text-lg font-bold text-white">€{price}</span>
              <span className="text-xs text-white/30">/person</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
