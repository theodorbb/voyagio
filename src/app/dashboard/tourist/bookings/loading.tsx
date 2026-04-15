export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="section-container max-w-4xl">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="mb-4 h-4 w-24 animate-pulse rounded-lg bg-white/[0.06]" />
          <div className="h-10 w-72 animate-pulse rounded-xl bg-white/[0.06]" />
          <div className="mt-3 h-4 w-48 animate-pulse rounded-lg bg-white/[0.04]" />
        </div>

        {/* Filter tabs skeleton */}
        <div className="mb-6 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-28 animate-pulse rounded-full bg-white/[0.06]" />
          ))}
        </div>

        {/* Card skeletons */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
              <div className="flex flex-col sm:flex-row">
                <div className="h-40 w-full shrink-0 animate-pulse bg-white/[0.06] sm:h-36 sm:w-48" />
                <div className="flex-1 p-5">
                  <div className="mb-2 flex gap-2">
                    <div className="h-5 w-20 animate-pulse rounded-full bg-white/[0.06]" />
                    <div className="h-5 w-24 animate-pulse rounded-full bg-white/[0.04]" />
                  </div>
                  <div className="h-5 w-56 animate-pulse rounded-lg bg-white/[0.06]" />
                  <div className="mt-2 h-3 w-40 animate-pulse rounded bg-white/[0.04]" />
                  <div className="mt-4 flex items-center gap-4">
                    <div className="h-3 w-24 animate-pulse rounded bg-white/[0.04]" />
                    <div className="h-3 w-20 animate-pulse rounded bg-white/[0.04]" />
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-3">
                    <div className="h-6 w-16 animate-pulse rounded bg-white/[0.06]" />
                    <div className="h-8 w-20 animate-pulse rounded-lg bg-white/[0.06]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
