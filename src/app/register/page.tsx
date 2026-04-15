"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Mail, Lock, User, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, Check } from "lucide-react";
import { fadeInUp, fadeIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordChecks = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains a number", met: /\d/.test(password) },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-24">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-accent/8 blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
        <div className="dot-pattern absolute inset-0 opacity-30" />
      </div>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-light">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-white">
              Voyagio
            </span>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="glass-card p-8"
        >
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold text-white">Create your account</h1>
            <p className="mt-2 text-sm text-white/50">
              Start planning unforgettable travel experiences
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-white/70">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={cn(
                    "w-full rounded-xl border bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all",
                    "border-white/[0.08] focus:border-accent/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-accent/20"
                  )}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/70">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={cn(
                    "w-full rounded-xl border bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all",
                    "border-white/[0.08] focus:border-accent/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-accent/20"
                  )}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/70">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "w-full rounded-xl border bg-white/[0.04] py-3 pl-10 pr-11 text-sm text-white placeholder-white/30 outline-none transition-all",
                    "border-white/[0.08] focus:border-accent/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-accent/20"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Password strength */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-2">
                      <Check
                        className={cn(
                          "h-3 w-3 transition-colors",
                          check.met ? "text-green-400" : "text-white/20"
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs transition-colors",
                          check.met ? "text-green-400" : "text-white/30"
                        )}
                      >
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "btn-primary w-full !rounded-xl !py-3 text-sm",
                loading && "pointer-events-none opacity-70"
              )}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-white/30">
            By creating an account, you agree to our Terms of Service
          </p>

          {/* Login link */}
          <p className="mt-4 text-center text-sm text-white/40">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-accent transition-colors hover:text-accent-light"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
