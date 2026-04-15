"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function CtaSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/20 via-accent/15 to-primary-light/20 blur-[120px]" />
      </div>

      <div className="section-container relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="glass-card relative mx-auto max-w-4xl overflow-hidden px-8 py-16 text-center md:px-16 md:py-20"
        >
          {/* Accent border glow */}
          <div className="absolute inset-px rounded-2xl bg-gradient-to-b from-accent/10 via-transparent to-primary-light/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

          <motion.div variants={fadeInUp}>
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-light">
              <Compass className="h-7 w-7 text-white" />
            </div>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
          >
            Ready to Plan Your{" "}
            <span className="gradient-text">Perfect Trip?</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/50 md:text-lg"
          >
            Join thousands of travelers who discover, plan, and book
            unforgettable experiences through Voyagio. Start your journey today.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/register" className="btn-primary px-8 py-3.5 text-base">
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/activities" className="btn-secondary px-8 py-3.5 text-base">
              Browse Activities
            </Link>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="mt-6 text-xs text-white/30"
          >
            Free to use for travelers. No credit card required.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
