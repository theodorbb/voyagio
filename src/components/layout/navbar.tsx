"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Compass,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";

function dashboardPath(role?: string) {
  switch (role) {
    case "OPERATOR":
      return "/dashboard/operator";
    case "ADMIN":
      return "/dashboard/admin";
    default:
      return "/dashboard/tourist";
  }
}

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dPath = dashboardPath(session?.user?.role);

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-500",
        isScrolled
          ? "border-b border-white/[0.06] bg-[var(--background)]/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav className="section-container flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-light transition-transform duration-300 group-hover:scale-105">
            <Compass className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            Voyagio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = link.href.startsWith("/#")
              ? false
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/[0.08] text-white"
                    : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth Area */}
        <div className="hidden items-center gap-3 md:flex">
          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-white/[0.06]" />
          ) : session?.user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:bg-white/[0.06]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent/80 to-accent-light/80 text-xs font-bold text-white">
                  {initials}
                </div>
                <span className="max-w-[120px] truncate text-sm font-medium text-white/80">
                  {session.user.name}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-white/40 transition-transform",
                    isUserMenuOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-white/[0.08] bg-[var(--surface)] shadow-2xl"
                  >
                    <div className="border-b border-white/[0.06] px-4 py-3">
                      <p className="text-sm font-medium text-white">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-white/40">
                        {session.user.email}
                      </p>
                      <span className="mt-1 inline-block rounded-full border border-white/[0.1] bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/40">
                        {session.user.role}
                      </span>
                    </div>
                    <div className="py-1">
                      <Link
                        href={dPath}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/onboarding"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
                      >
                        <User className="h-4 w-4" />
                        Preferences
                      </Link>
                    </div>
                    <div className="border-t border-white/[0.06] py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400/80 transition-colors hover:bg-white/[0.04] hover:text-red-400"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Sign In
              </Link>
              <Link href="/register" className="btn-primary !py-2 !px-5 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/[0.06] bg-[var(--background)]/95 backdrop-blur-xl md:hidden"
          >
            <div className="section-container flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => {
                const isActive = link.href.startsWith("/#")
                  ? false
                  : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-white/[0.08] text-white"
                        : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-3 flex flex-col gap-2 border-t border-white/[0.06] pt-4">
                {session?.user ? (
                  <>
                    <div className="mb-2 flex items-center gap-3 px-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent/80 to-accent-light/80 text-xs font-bold text-white">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-white/40">
                          {session.user.role}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={dPath}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-lg px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="rounded-lg px-4 py-3 text-left text-sm font-medium text-red-400/70 transition-colors hover:bg-white/[0.06] hover:text-red-400"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-lg px-4 py-3 text-center text-sm font-medium text-white/70 transition-colors hover:text-white"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-primary text-center"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
