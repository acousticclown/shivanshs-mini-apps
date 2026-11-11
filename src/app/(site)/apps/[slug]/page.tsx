import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { SiteHeader } from "@/components/portal/SiteHeader";
import {
  getAppBySlugCached,
  getSettingsCached,
} from "@/lib/portal-cache";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = await getAppBySlugCached(slug);
  if (!app) return { title: "App not found" };
  return {
    title: app.name,
    description: app.short_description || app.description,
  };
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [settings, app] = await Promise.all([
    getSettingsCached(),
    getAppBySlugCached(slug),
  ]);
  if (!app) notFound();

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="site-shell py-10 sm:py-14">
        <Link
          href="/apps"
          prefetch
          className="text-sm font-700 text-ink-soft hover:text-ink"
        >
          ← Directory
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              {app.category_name && (
                <span className="rounded-full bg-paper-deep px-3 py-1 text-xs font-700 uppercase tracking-wide text-ink-soft">
                  {app.category_name}
                </span>
              )}
              {app.featured && (
                <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-700 uppercase tracking-wide text-accent-deep">
                  Featured
                </span>
              )}
            </div>
            <h1 className="mt-4 font-display text-4xl font-800 tracking-tight text-ink sm:text-6xl">
              {app.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              {app.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {app.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-xs font-semibold text-ink-soft"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {app.live_url && (
                <a
                  href={app.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Launch app
                </a>
              )}
              {app.github_url && (
                <a
                  href={app.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                >
                  GitHub
                </a>
              )}
              {app.docs_url && (
                <a
                  href={app.docs_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                >
                  Docs
                </a>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-6">
            <h2 className="font-display text-xl font-700 tracking-tight">
              Details
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Status</dt>
                <dd className="font-semibold capitalize">
                  {app.publication_status}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Hosting</dt>
                <dd className="font-semibold capitalize">
                  {app.hosting_provider}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Visibility</dt>
                <dd className="font-semibold capitalize">{app.visibility}</dd>
              </div>
              {app.published_at && (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Published</dt>
                  <dd className="font-semibold">
                    {new Date(app.published_at).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </aside>
        </div>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
