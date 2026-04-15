"use client";

import { motion } from "framer-motion";
import { Clock, Star, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { FEATURED_ACTIVITIES } from "@/lib/constants";

export function ActivitiesShowcase() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Subtle bg gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary-dark/20 to-transparent" />

      <div className="section-container relative">
        <SectionHeader
          badge="Curated Experiences"
          title="Handpicked Activities for Every Traveler"
          description="From adrenaline-fueled adventures to peaceful cultural explorations — find experiences that match your travel personality."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURED_ACTIVITIES.map((activity) => (
            <motion.div
              key={activity.title}
              variants={fadeInUp}
              className="glass-card-hover group overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Category badge */}
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                    {activity.category}
                  </span>
                </div>

                {/* Price badge */}
                <div className="absolute right-3 top-3">
                  <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-white">
                    €{activity.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2 text-[11px] text-white/40">
                  <MapPin className="h-3 w-3" />
                  <span>{activity.destination}</span>
                </div>

                <h3 className="font-display text-base font-semibold text-white transition-colors group-hover:text-primary-light">
                  {activity.title}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {activity.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-accent-light text-accent-light" />
                    <span className="text-xs font-semibold text-white">
                      {activity.rating}
                    </span>
                    <span className="text-[11px] text-white/30">
                      ({activity.reviewCount})
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
