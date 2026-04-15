export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="section-container">
        {/* Back link */}
        <div className="mb-6 h-4 w-24 animate-pulse rounded-lg bg-white/[0.06]" />

        {/* Trip name */}
        <div className="mb-2 h-10 w-72 animate-pulse rounded-xl bg-white/[0.06]" />
        <div className="mb-8 flex gap-3">
          <div className="h-6 w-20 animate-pulse rounded-full bg-white/[0.06]" />
          <div className="h-6 w-32 animate-pulse rounded-full bg-white/[0.04]" />
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.03]" />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.03]" />
        </div>
      </div>
    </div>
  );
}
