import Link from "next/link";
import { AppCard } from "@/components/portal/AppCard";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { SiteHeader } from "@/components/portal/SiteHeader";
import {
  getSettingsCached,
  listPublicAppsCached,
} from "@/lib/portal-cache";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, featured, all] = await Promise.all([
    getSettingsCached(),
    listPublicAppsCached({ featured: true }),
    listPublicAppsCached(),
  ]);
  const featuredApps = featured.length ? featured : all.slice(0, 3);

  return (
    <>
      <div className="relative isolate min-h-[100svh] overflow-hidden">
        <div className="hero-plane absolute inset-0 -z-10" />
        <div className="hero-glow absolute inset-0 -z-10" aria-hidden />
        <div className="hero-orb hero-orb-a" aria-hidden />
        <div className="hero-orb hero-orb-b" aria-hidden />

        <SiteHeader settings={settings} tone="dark" />

        <section className="site-shell flex min-h-[calc(100svh-5.5rem)] flex-col justify-end pb-20 pt-12 sm:pb-24">
          <p className="animate-rise font-display text-[clamp(3.4rem,12vw,7.5rem)] font-800 leading-[0.9] tracking-tight text-white">
            {settings.brand_name}
          </p>
          <h1 className="animate-rise-delay mt-6 max-w-xl text-xl font-medium leading-snug text-white/88 sm:text-2xl">
            {settings.tagline || "Personal software, shipped."}
          </h1>
          <p className="animate-rise-delay-2 mt-4 max-w-md text-base leading-relaxed text-white/68 sm:text-lg">
            Mini apps from an autonomous factory — curated by hand.
          </p>
          <div className="animate-rise-delay-2 mt-9 flex flex-wrap gap-3">
            <Link
              href={settings.primary_cta_href || "/apps"}
              prefetch
              className="btn btn-primary"
            >
              {settings.primary_cta_label || "Browse apps"}
            </Link>
            <Link
              href={settings.secondary_cta_href || "/#about"}
              prefetch
              className="btn btn-ghost"
            >
              {settings.secondary_cta_label || "About"}
            </Link>
          </div>
        </section>
      </div>

      <section className="site-shell py-20 sm:py-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-700 tracking-tight text-ink sm:text-4xl">
              Featured
            </h2>
            <p className="mt-2 text-ink-soft">Live apps from the factory.</p>
          </div>
          <Link
            href="/apps"
            prefetch
            className="text-sm font-700 text-accent hover:text-accent-deep"
          >
            All apps →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>

      <section id="about" className="border-t border-[var(--line)] py-20 sm:py-24">
        <div className="site-shell max-w-3xl">
          <h2 className="font-display text-3xl font-700 tracking-tight text-ink sm:text-4xl">
            Autonomous factory. Human curation.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
            Plain-English ideas become shipped software: spec, build, test,
            deploy, and register here. The portal is the source of truth for
            what the public sees.
          </p>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </>
  );
}
