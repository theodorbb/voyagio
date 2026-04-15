export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="section-container">
        {/* Header */}
        <div className="mb-8">
          <div className="h-10 w-64 animate-pulse rounded-xl bg-white/[0.06]" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded-lg bg-white/[0.04]" />
        </div>

        {/* Destination selector */}
        <div className="mb-6 h-14 animate-pulse rounded-xl border border-white/[0.08] bg-white/[0.03]" />

        {/* Date & budget */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl border border-white/[0.08] bg-white/[0.03]" />
          ))}
        </div>

        {/* Activity list */}
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.03]" />
          ))}
        </div>
      </div>
    </div>
  );
}
