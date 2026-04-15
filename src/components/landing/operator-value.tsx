"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/shared/section-header";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { OPERATOR_FEATURES } from "@/lib/constants";

export function OperatorValue() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-surface-dark to-[var(--background)]" />
        <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-accent/8 blur-[120px]" />
      </div>

      <div className="section-container relative">
        <SectionHeader
          badge="For Tourism Operators"
          title="Powerful Tools to Grow Your Business"
          description="Voyagio is more than a traveler platform. It's a complete management suite for tourism operators to streamline operations and maximize revenue."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {OPERATOR_FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              className="glass-card-hover group p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 transition-colors group-hover:border-accent/30 group-hover:bg-accent/15">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-display text-base font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/40">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link href="/register" className="btn-secondary">
            Become an Operator
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
