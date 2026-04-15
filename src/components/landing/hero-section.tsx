"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { fadeInUp, staggerContainer, fadeIn } from "@/lib/motion";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -right-40 bottom-20 h-[400px] w-[400px] rounded-full bg-accent/15 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-light/10 blur-[140px]" />

        {/* Dot grid pattern */}
        <div className="dot-pattern absolute inset-0 opacity-40" />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />
      </div>

      <div className="section-container relative z-10 pb-20 pt-32 md:pt-40 lg:pt-44">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white/60 backdrop-blur-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-400">
                <span className="inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              </span>
              Smart Tourism Activity Platform
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={fadeInUp}
            className="mt-8 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Discover, Plan &{" "}
            <span className="gradient-text">Experience</span>{" "}
            Tourism Like Never Before
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/50 md:text-lg lg:text-xl"
          >
            Voyagio connects travelers with curated local activities and gives
            tourism operators the tools to manage experiences, schedules, and
            bookings — all on one intelligent platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/register" className="btn-primary px-8 py-3.5 text-base">
              Start Planning Your Trip
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/#how-it-works" className="btn-secondary px-8 py-3.5 text-base">
              <Play className="h-4 w-4" />
              See How It Works
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={fadeIn}
            className="mt-16 flex flex-col items-center gap-3"
          >
            <div className="flex -space-x-2">
              {["S", "M", "A", "J", "L"].map((letter, i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--background)] bg-gradient-to-br from-primary-light/80 to-primary text-xs font-bold text-white"
                >
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-sm text-white/40">
              Trusted by <span className="font-semibold text-white/60">25,000+</span> travelers worldwide
            </p>
          </motion.div>
        </motion.div>

        {/* Floating Destination Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="pointer-events-none absolute inset-0 hidden lg:block"
        >
          {/* Left floating badges */}
          <div className="absolute left-8 top-[35%] animate-float" style={{ animationDelay: "0s" }}>
            <div className="glass-card flex items-center gap-3 px-4 py-2.5 shadow-xl">
              <span className="text-xl">🏄</span>
              <div>
                <p className="text-xs font-semibold text-white">Bali</p>
                <p className="text-[10px] text-white/40">27 activities</p>
              </div>
            </div>
          </div>

          <div className="absolute left-16 bottom-[30%] animate-float" style={{ animationDelay: "2s" }}>
            <div className="glass-card flex items-center gap-3 px-4 py-2.5 shadow-xl">
              <span className="text-xl">🍷</span>
              <div>
                <p className="text-xs font-semibold text-white">Porto</p>
                <p className="text-[10px] text-white/40">15 activities</p>
              </div>
            </div>
          </div>

          {/* Right floating badges */}
          <div className="absolute right-8 top-[40%] animate-float" style={{ animationDelay: "1s" }}>
            <div className="glass-card flex items-center gap-3 px-4 py-2.5 shadow-xl">
              <span className="text-xl">🏛️</span>
              <div>
                <p className="text-xs font-semibold text-white">Barcelona</p>
                <p className="text-[10px] text-white/40">31 activities</p>
              </div>
            </div>
          </div>

          <div className="absolute right-20 bottom-[25%] animate-float" style={{ animationDelay: "3s" }}>
            <div className="glass-card flex items-center gap-3 px-4 py-2.5 shadow-xl">
              <span className="text-xl">🌅</span>
              <div>
                <p className="text-xs font-semibold text-white">Santorini</p>
                <p className="text-[10px] text-white/40">18 activities</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
