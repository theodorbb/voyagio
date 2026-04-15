export default function Loading() {
  return (
    <div className="section-container py-28">
      {/* Header skeleton */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-3 h-4 w-28 animate-pulse rounded-lg bg-white/[0.06]" />
        <div className="mx-auto h-10 w-80 animate-pulse rounded-xl bg-white/[0.06]" />
        <div className="mx-auto mt-3 h-4 w-64 animate-pulse rounded-lg bg-white/[0.04]" />
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <div className="aspect-[16/10] w-full animate-pulse bg-white/[0.06]" />
            <div className="p-5">
              <div className="h-6 w-40 animate-pulse rounded-lg bg-white/[0.06]" />
              <div className="mt-2 h-3 w-24 animate-pulse rounded bg-white/[0.04]" />
              <div className="mt-3 h-3 w-full animate-pulse rounded bg-white/[0.04]" />
              <div className="mt-1 h-3 w-3/4 animate-pulse rounded bg-white/[0.04]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
