export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="section-container">
        <div className="mb-8">
          <div className="mb-4 h-4 w-24 animate-pulse rounded-lg bg-white/[0.06]" />
          <div className="h-10 w-64 animate-pulse rounded-xl bg-white/[0.06]" />
          <div className="mt-3 h-4 w-40 animate-pulse rounded-lg bg-white/[0.04]" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.03]" />
          ))}
        </div>
      </div>
    </div>
  );
}
