"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#080D19] font-sans text-[#F1F5F9] antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
              Something went wrong
            </h1>
            <p className="mb-8 max-w-md text-sm leading-relaxed text-white/50">
              An unexpected error occurred. You can try again or return to the
              home page.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => reset()}
                className="inline-flex items-center gap-2 rounded-full bg-[#F4845F] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#F4845F]/90 hover:shadow-lg hover:shadow-[#F4845F]/25 active:scale-[0.98]"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10 active:scale-[0.98]"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
