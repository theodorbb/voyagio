export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="section-container">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="mb-1 h-4 w-32 animate-pulse rounded-lg bg-white/[0.06]" />
          <div className="h-10 w-64 animate-pulse rounded-xl bg-white/[0.06]" />
          <div className="mt-3 h-4 w-48 animate-pulse rounded-lg bg-white/[0.04]" />
        </div>

        {/* Stats grid skeleton */}
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="h-3 w-20 animate-pulse rounded bg-white/[0.06]" />
                  <div className="mt-2 h-8 w-12 animate-pulse rounded-lg bg-white/[0.08]" />
                </div>
                <div className="h-10 w-10 animate-pulse rounded-xl bg-white/[0.06]" />
              </div>
            </div>
          ))}
        </div>

        {/* Quick nav skeleton */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.03]" />
          ))}
        </div>

        {/* Two column skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="glass-card p-6">
              <div className="mb-4 h-5 w-36 animate-pulse rounded-lg bg-white/[0.06]" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-14 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02]" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
