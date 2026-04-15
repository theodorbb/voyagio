import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="section-container text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <Compass className="h-10 w-10 text-white/15" />
        </div>
        <h1 className="font-display text-5xl font-bold text-white">404</h1>
        <p className="mt-3 text-lg text-white/40">
          This page doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/" className="btn-primary !rounded-xl">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Link href="/activities" className="btn-secondary !rounded-xl">
            Explore Activities
          </Link>
        </div>
      </div>
    </div>
  );
}
