"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { TESTIMONIALS, PLATFORM_STATS } from "@/lib/constants";

export function Testimonials() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-surface-dark/50 to-transparent" />

      <div className="section-container relative">
        {/* Stats row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 grid grid-cols-2 gap-6 md:mb-28 lg:grid-cols-4"
        >
          {PLATFORM_STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="group text-center"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] transition-colors group-hover:border-primary-light/20 group-hover:bg-primary-light/5">
                <stat.icon className="h-5 w-5 text-white/40 transition-colors group-hover:text-primary-light" />
              </div>
              <p className="font-display text-3xl font-bold text-white md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-white/40">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <SectionHeader
          badge="Traveler Stories"
          title="Loved by Travelers & Operators"
          description="Don't take our word for it. Here's what the Voyagio community has to say."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={fadeInUp}
              className="glass-card-hover relative p-6"
            >
              <Quote className="mb-4 h-8 w-8 text-accent/30" />

              <p className="text-sm leading-relaxed text-white/60">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary text-sm font-bold text-white">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-white/40">{testimonial.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-accent-light text-accent-light"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
