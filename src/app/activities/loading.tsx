export default function Loading() {
  return (
    <div className="section-container py-28">
      {/* Page header skeleton */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-3 h-4 w-32 animate-pulse rounded-lg bg-white/[0.06]" />
        <div className="mx-auto h-10 w-72 animate-pulse rounded-xl bg-white/[0.06]" />
        <div className="mx-auto mt-3 h-4 w-56 animate-pulse rounded-lg bg-white/[0.04]" />
      </div>

      {/* Filter bar skeleton */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-white/[0.06]" />
        ))}
      </div>

      {/* Card grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <div className="aspect-[16/10] w-full animate-pulse bg-white/[0.06]" />
            <div className="p-5">
              <div className="mb-2 flex gap-2">
                <div className="h-5 w-20 animate-pulse rounded-full bg-white/[0.06]" />
              </div>
              <div className="h-5 w-48 animate-pulse rounded-lg bg-white/[0.06]" />
              <div className="mt-2 h-3 w-32 animate-pulse rounded bg-white/[0.04]" />
              <div className="mt-4 flex items-center justify-between">
                <div className="h-5 w-16 animate-pulse rounded bg-white/[0.06]" />
                <div className="flex items-center gap-2">
                  <div className="h-4 w-12 animate-pulse rounded bg-white/[0.04]" />
                  <div className="h-4 w-8 animate-pulse rounded bg-white/[0.04]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
