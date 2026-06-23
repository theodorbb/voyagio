"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { SafeImage } from "@/components/shared/safe-image";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { FEATURED_DESTINATIONS } from "@/lib/constants";

export function FeaturedDestinations() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="section-container">
        <SectionHeader
          badge="Popular Destinations"
          title="Explore the World's Best Experiences"
          description="Discover curated destinations with handpicked activities tailored to every type of traveler."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >

          <motion.div
            variants={fadeInUp}
            className="group relative row-span-2 overflow-hidden rounded-2xl sm:col-span-2 lg:col-span-1"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <SafeImage
                src={FEATURED_DESTINATIONS[0].image}
                alt={FEATURED_DESTINATIONS[0].name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="transform-gpu object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-medium text-white/60">
                  {FEATURED_DESTINATIONS[0].country}
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white">
                {FEATURED_DESTINATIONS[0].name}
              </h3>
              <p className="mt-1 text-sm text-white/60">
                {FEATURED_DESTINATIONS[0].description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-white/40">
                  {FEATURED_DESTINATIONS[0].activityCount} activities
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-accent-light text-accent-light" />
                  <span className="text-xs font-semibold text-white">
                    {FEATURED_DESTINATIONS[0].rating}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {FEATURED_DESTINATIONS.slice(1, 4).map((dest) => (
            <motion.div
              key={dest.name}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <SafeImage
                  src={dest.image}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="transform-gpu object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="mb-1.5 flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-accent" />
                  <span className="text-[11px] font-medium text-white/60">
                    {dest.country}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  {dest.name}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-white/40">
                    {dest.activityCount} activities
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-accent-light text-accent-light" />
                    <span className="text-xs font-semibold text-white">
                      {dest.rating}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/destinations"
            className="group inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/70 transition-all hover:border-accent/40 hover:bg-accent/[0.08] hover:text-white"
          >
            View all destinations
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
