import Link from "next/link";
import type { Application } from "@/types/registry";

export function AppCard({ app }: { app: Application }) {
  return (
    <article className="group relative overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-5 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_20px_50px_rgba(15,118,110,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div
          className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-accent to-[#0ea5e9] font-display text-lg font-700 text-white"
          aria-hidden
        >
          {app.name.slice(0, 1)}
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {app.featured && (
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-700 uppercase tracking-wide text-accent-deep">
              Featured
            </span>
          )}
          {app.category_name && (
            <span className="rounded-full bg-paper-deep px-2.5 py-1 text-[11px] font-700 uppercase tracking-wide text-ink-soft">
              {app.category_name}
            </span>
          )}
        </div>
      </div>
      <h3 className="mt-4 font-display text-xl font-700 tracking-tight text-ink">
        <Link
          href={`/apps/${app.slug}`}
          prefetch
          className="after:absolute after:inset-0"
        >
          {app.name}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
        {app.short_description || app.description}
      </p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {app.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold text-ink-soft/80"
            >
              #{tag}
            </span>
          ))}
        </div>
        {app.live_url ? (
          <a
            href={app.live_url}
            target="_blank"
            rel="noreferrer"
            className="relative z-10 text-sm font-700 text-accent hover:text-accent-deep"
          >
            Launch →
          </a>
        ) : (
          <span className="text-sm font-semibold text-ink-soft">Details →</span>
        )}
      </div>
    </article>
  );
}
