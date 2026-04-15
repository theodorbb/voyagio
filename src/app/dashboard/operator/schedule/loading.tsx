export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="section-container">
        <div className="mb-8">
          <div className="h-10 w-48 animate-pulse rounded-xl bg-white/[0.06]" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded-lg bg-white/[0.04]" />
        </div>
        <div className="grid gap-4 md:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-6 w-full animate-pulse rounded-lg bg-white/[0.06]" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-16 animate-pulse rounded-xl border border-white/[0.08] bg-white/[0.03]" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
