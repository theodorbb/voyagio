"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

interface DestinationCardProps {
  name: string;
  slug: string;
  country: string;
  description: string;
  coverImage: string;
  activityCount: number;
  rating: number;
  highlights?: string[];
  featured?: boolean;
  index?: number;
}

export function DestinationCard({
  name,
  slug,
  country,
  description,
  coverImage,
  activityCount,
  rating,
  highlights,
  featured,
  index = 0,
}: DestinationCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08 }}
    >
      <Link
        href={`/destinations/${slug}`}
        className="group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-lg hover:shadow-primary-light/5"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={coverImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />

          {featured && (
            <div className="absolute left-3 top-3 rounded-full bg-accent/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              Featured
            </div>
          )}

          {/* Rating badge */}
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-white">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-2 flex items-center gap-1.5 text-xs text-white/40">
            <MapPin className="h-3 w-3" />
            <span>{country}</span>
          </div>

          <h3 className="font-display text-lg font-bold text-white transition-colors group-hover:text-accent-light">
            {name}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/50">
            {description}
          </p>

          {/* Highlights tags */}
          {highlights && highlights.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {highlights.slice(0, 3).map((h) => (
                <span
                  key={h}
                  className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-white/40"
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
            <span className="text-xs text-white/30">
              {activityCount} {activityCount === 1 ? "activity" : "activities"}
            </span>
            <span className="text-xs font-medium text-accent transition-colors group-hover:text-accent-light">
              Explore →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
