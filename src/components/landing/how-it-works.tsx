"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/section-header";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden">
      <div className="section-container">
        <SectionHeader
          badge="Simple Process"
          title="How Voyagio Works"
          description="From discovery to experience in four simple steps. We handle the complexity so you can focus on enjoying your trip."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Connection line (desktop only) */}
          <div className="pointer-events-none absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block" />

          {HOW_IT_WORKS_STEPS.map((step) => (
            <motion.div
              key={step.step}
              variants={fadeInUp}
              className="group relative text-center"
            >
              {/* Step number */}
              <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all duration-500 group-hover:border-accent/30 group-hover:bg-accent/10" />
                <step.icon className="relative z-10 h-7 w-7 text-white/60 transition-colors group-hover:text-accent" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  {step.step}
                </span>
              </div>

              <h3 className="font-display text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/40">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
