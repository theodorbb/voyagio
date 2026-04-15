export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="relative h-[45vh] min-h-[360px] animate-pulse bg-white/[0.04]">
        <div className="section-container relative flex h-full flex-col justify-end pb-10 pt-28">
          <div className="mb-2 flex gap-2">
            <div className="h-5 w-24 rounded-full bg-white/[0.06]" />
            <div className="h-5 w-32 rounded bg-white/[0.04]" />
          </div>
          <div className="h-12 w-96 max-w-full rounded-xl bg-white/[0.06]" />
          <div className="mt-3 flex gap-4">
            <div className="h-4 w-20 rounded bg-white/[0.04]" />
            <div className="h-4 w-20 rounded bg-white/[0.04]" />
            <div className="h-4 w-20 rounded bg-white/[0.04]" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="section-container py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div>
              <div className="mb-4 h-6 w-48 animate-pulse rounded-lg bg-white/[0.06]" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-white/[0.04]" />
                <div className="h-4 w-full animate-pulse rounded bg-white/[0.04]" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.04]" />
              </div>
            </div>
            <div>
              <div className="mb-4 h-6 w-32 animate-pulse rounded-lg bg-white/[0.06]" />
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02]" />
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="h-72 animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.03]" />
          </div>
        </div>
      </div>
    </div>
  );
}
