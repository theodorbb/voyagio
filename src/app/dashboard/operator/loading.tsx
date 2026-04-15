export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="section-container">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="mb-1 h-4 w-36 animate-pulse rounded-lg bg-accent/10" />
          <div className="h-10 w-60 animate-pulse rounded-xl bg-white/[0.06]" />
          <div className="mt-3 h-4 w-48 animate-pulse rounded-lg bg-white/[0.04]" />
        </div>

        {/* KPI cards skeleton */}
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="glass-card p-5">
              <div className="h-3 w-16 animate-pulse rounded bg-white/[0.06]" />
              <div className="mt-2 h-7 w-12 animate-pulse rounded-lg bg-white/[0.08]" />
              <div className="mt-2 h-3 w-24 animate-pulse rounded bg-white/[0.04]" />
            </div>
          ))}
        </div>

        {/* Panels skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="glass-card p-6">
              <div className="mb-5 h-5 w-40 animate-pulse rounded-lg bg-white/[0.06]" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-16 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02]" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
