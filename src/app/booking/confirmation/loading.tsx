export default function Loading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-24">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 h-20 w-20 animate-pulse rounded-full bg-white/[0.06]" />
        <div className="mx-auto mb-2 h-8 w-56 animate-pulse rounded-xl bg-white/[0.06]" />
        <div className="mx-auto mb-8 h-4 w-72 animate-pulse rounded-lg bg-white/[0.04]" />
        <div className="glass-card mx-auto max-w-md p-6">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-20 animate-pulse rounded bg-white/[0.06]" />
                <div className="h-4 w-28 animate-pulse rounded bg-white/[0.04]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
