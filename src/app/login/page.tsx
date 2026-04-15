"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Mail, Lock, ArrowRight, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { fadeInUp, fadeIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Fetch session to determine role-based redirect
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      const role = session?.user?.role;

      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (role === "OPERATOR") {
        router.push("/dashboard/operator");
      } else if (role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/tourist");
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-24">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-accent/8 blur-[100px]" />
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
            <h1 className="font-display text-2xl font-bold text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-white/50">
              Sign in to continue your travel journey
            </p>
          </div>

          {/* Success message after registration */}
          {registered && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <p className="text-sm text-green-300">
                Account created! Sign in to get started.
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">
              Demo Accounts
            </p>
            <div className="space-y-1.5">
              {[
                { label: "Tourist", email: "tourist@voyagio.com" },
                { label: "Operator", email: "operator@voyagio.com" },
                { label: "Admin", email: "admin@voyagio.com" },
              ].map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => {
                    setEmail(demo.email);
                    setPassword("voyagio123");
                    setError("");
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs transition-colors hover:bg-white/[0.04]"
                >
                  <span className="text-white/50">{demo.label}</span>
                  <span className="font-mono text-white/30">{demo.email}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-center text-xs text-white/20">
              Password: voyagio123
            </p>
          </div>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-white/40">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-accent transition-colors hover:text-accent-light"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
