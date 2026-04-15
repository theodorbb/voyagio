export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="section-container max-w-4xl">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="mb-4 h-4 w-24 animate-pulse rounded-lg bg-white/[0.06]" />
          <div className="h-10 w-56 animate-pulse rounded-xl bg-white/[0.06]" />
          <div className="mt-3 h-4 w-40 animate-pulse rounded-lg bg-white/[0.04]" />
        </div>

        {/* Review card skeletons */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
              <div className="flex flex-col sm:flex-row">
                <div className="h-36 w-full shrink-0 animate-pulse bg-white/[0.06] sm:h-auto sm:w-40" />
                <div className="flex-1 p-5">
                  <div className="mb-2 flex gap-2">
                    <div className="h-5 w-20 animate-pulse rounded-full bg-white/[0.06]" />
                    <div className="h-5 w-16 animate-pulse rounded-full bg-amber-500/10" />
                  </div>
                  <div className="h-5 w-52 animate-pulse rounded-lg bg-white/[0.06]" />
                  <div className="mt-2 h-3 w-32 animate-pulse rounded bg-white/[0.04]" />
                  <div className="mt-3 h-12 w-full animate-pulse rounded-lg bg-white/[0.04]" />
                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-3">
                    <div className="h-3 w-28 animate-pulse rounded bg-white/[0.04]" />
                    <div className="h-8 w-16 animate-pulse rounded-lg bg-white/[0.06]" />
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
