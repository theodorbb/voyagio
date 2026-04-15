"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-24">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="mb-2 font-display text-2xl font-bold text-white">
          Something went wrong
        </h1>
        <p className="mb-8 max-w-md text-sm leading-relaxed text-white/50">
          We hit an unexpected error loading this page. You can try again or head
          back to safety.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => reset()} className="btn-primary">
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            <Home className="h-4 w-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
