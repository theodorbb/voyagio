export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="relative h-[50vh] min-h-[400px] animate-pulse bg-white/[0.04]">
        <div className="section-container relative flex h-full flex-col justify-end pb-10 pt-28">
          <div className="h-5 w-24 rounded-full bg-white/[0.06]" />
          <div className="mt-3 h-12 w-80 max-w-full rounded-xl bg-white/[0.06]" />
          <div className="mt-3 h-4 w-48 rounded bg-white/[0.04]" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="section-container py-12">
        <div className="mb-8 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-white/[0.04]" />
          <div className="h-4 w-full animate-pulse rounded bg-white/[0.04]" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-white/[0.04]" />
        </div>

        <div className="h-6 w-48 animate-pulse rounded-lg bg-white/[0.06]" />
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
              <div className="aspect-[16/10] w-full animate-pulse bg-white/[0.06]" />
              <div className="p-5">
                <div className="h-5 w-40 animate-pulse rounded-lg bg-white/[0.06]" />
                <div className="mt-2 h-3 w-28 animate-pulse rounded bg-white/[0.04]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
