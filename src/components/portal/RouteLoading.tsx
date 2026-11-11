/** Prefetchable App Shell fallback — shown instantly on soft navigation. */
export function RouteLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="site-shell animate-pulse py-10 sm:py-14" aria-busy aria-label={label}>
      <div className="flex items-center justify-between gap-6 py-1">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-paper-deep" />
          <div className="h-5 w-40 rounded bg-paper-deep" />
        </div>
        <div className="flex gap-3">
          <div className="h-4 w-16 rounded bg-paper-deep" />
          <div className="h-9 w-28 rounded-full bg-paper-deep" />
        </div>
      </div>
      <div className="mt-12 max-w-xl space-y-3">
        <div className="h-10 w-2/3 rounded-lg bg-paper-deep" />
        <div className="h-4 w-full rounded bg-paper-deep" />
        <div className="h-4 w-5/6 rounded bg-paper-deep" />
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-44 rounded-[1.5rem] border border-[var(--line)] bg-white/50"
          />
        ))}
      </div>
    </div>
  );
}
