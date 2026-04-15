import Link from "next/link";
import { Compass, Globe, MessageCircle, Mail } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[var(--background)]">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-light">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Voyagio
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              A smart tourism platform for discovering, planning, and booking
              unforgettable travel experiences.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/30">
              Explore
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Operators */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/30">
              For Operators
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/register" className="text-sm text-white/50 transition-colors hover:text-white">
                  List Your Activity
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-white/50 transition-colors hover:text-white">
                  Operator Dashboard
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-white/50 transition-colors hover:text-white">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/30">
              Connect
            </h4>
            <div className="flex gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-white/40 transition-colors hover:border-white/20 hover:text-white">
                <MessageCircle className="h-4 w-4" />
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-white/40 transition-colors hover:border-white/20 hover:text-white">
                <Globe className="h-4 w-4" />
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-white/40 transition-colors hover:border-white/20 hover:text-white">
                <Mail className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-4 text-sm text-white/50">hello@voyagio.com</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Voyagio. Dissertation Project — Tourism Activity Management Platform.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-white/30 hover:text-white/50 cursor-pointer transition-colors">Privacy</span>
            <span className="text-xs text-white/30 hover:text-white/50 cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
