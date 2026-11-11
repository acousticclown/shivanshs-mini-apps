import Link from "next/link";
import { AppCard } from "@/components/portal/AppCard";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { SiteHeader } from "@/components/portal/SiteHeader";
import { getSettings, listCategories, listPublicApps } from "@/lib/portal";

export const metadata = {
  title: "Directory",
};

export const revalidate = 60;

export default async function AppsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const [settings, categories, apps] = await Promise.all([
    getSettings(),
    listCategories(),
    listPublicApps({ q: params.q, category: params.category }),
  ]);

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="site-shell py-10 sm:py-14">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-800 tracking-tight text-ink sm:text-5xl">
            Directory
          </h1>
          <p className="mt-3 text-ink-soft">
            Browse published mini apps. Each launches in its own surface.
          </p>
        </div>

        <form className="mt-8 flex flex-col gap-3 sm:flex-row" method="get">
          <input
            className="input"
            type="search"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Search apps, tags, descriptions…"
            aria-label="Search apps"
          />
          <select
            className="select sm:max-w-xs"
            name="category"
            defaultValue={params.category ?? ""}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-ink whitespace-nowrap">
            Filter
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/apps"
            className={`rounded-full px-3 py-1.5 text-xs font-700 uppercase tracking-wide ${
              !params.category
                ? "bg-ink text-white"
                : "bg-white/70 text-ink-soft"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/apps?category=${c.slug}${params.q ? `&q=${encodeURIComponent(params.q)}` : ""}`}
              className={`rounded-full px-3 py-1.5 text-xs font-700 uppercase tracking-wide ${
                params.category === c.slug
                  ? "bg-ink text-white"
                  : "bg-white/70 text-ink-soft"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
        {!apps.length && (
          <p className="mt-12 rounded-[1.25rem] border border-dashed border-[var(--line)] bg-white/60 p-10 text-center text-ink-soft">
            No published apps match this filter yet.
          </p>
        )}
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
