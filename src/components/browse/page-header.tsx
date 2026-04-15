"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

interface PageHeaderProps {
  title: string;
  highlight?: string;
  description: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, highlight, description, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden pb-8 pt-28 md:pt-36">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />
        <div className="dot-pattern absolute inset-0 opacity-20" />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-2xl text-center"
        >
          <h1 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            {title}{" "}
            {highlight && <span className="gradient-text">{highlight}</span>}
          </h1>
          <p className="mt-4 text-base text-white/50 md:text-lg">{description}</p>
        </motion.div>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
