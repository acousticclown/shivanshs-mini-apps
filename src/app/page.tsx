import Link from "next/link";
import { AppCard } from "@/components/portal/AppCard";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { SiteHeader } from "@/components/portal/SiteHeader";
import { getSettings, listPublicApps } from "@/lib/portal";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, featured, all] = await Promise.all([
    getSettings(),
    listPublicApps({ featured: true }),
    listPublicApps(),
  ]);
  const featuredApps = featured.length ? featured : all.slice(0, 3);

  return (
    <>
      <div className="relative isolate min-h-[100svh] overflow-hidden">
        <div className="hero-plane absolute inset-0 -z-10" />
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="animate-drift absolute left-[8%] top-[22%] h-40 w-56 rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-md" />
          <div className="animate-drift absolute right-[12%] top-[34%] h-48 w-40 rounded-[2rem] border border-white/15 bg-white/5 backdrop-blur-md [animation-delay:1.2s]" />
          <div className="animate-drift absolute bottom-[18%] left-[28%] h-28 w-72 rounded-full border border-teal-200/20 bg-teal-300/10 blur-[1px] [animation-delay:0.6s]" />
        </div>

        <SiteHeader settings={settings} tone="dark" />

        <section className="site-shell flex min-h-[calc(100svh-5.5rem)] flex-col justify-end pb-16 pt-10 sm:pb-20">
          <p className="animate-rise font-display text-5xl font-800 tracking-tight text-white sm:text-7xl lg:text-8xl">
            {settings.brand_name}
          </p>
          <h1 className="animate-rise-delay mt-5 max-w-2xl text-2xl font-medium leading-snug text-white/90 sm:text-3xl">
            {settings.tagline}
          </h1>
          <p className="animate-rise-delay-2 mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            {settings.intro}
          </p>
          <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <Link href={settings.primary_cta_href || "/apps"} className="btn btn-primary">
              {settings.primary_cta_label || "Browse apps"}
            </Link>
            <Link
              href={settings.secondary_cta_href || "/#about"}
              className="btn btn-ghost"
            >
              {settings.secondary_cta_label || "About"}
            </Link>
          </div>
        </section>
      </div>

      <section className="site-shell py-16 sm:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-700 tracking-tight text-ink sm:text-4xl">
              Featured
            </h2>
            <p className="mt-2 text-ink-soft">
              Highlighted mini apps from the factory.
            </p>
          </div>
          <Link href="/apps" className="text-sm font-700 text-accent hover:text-accent-deep">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>

      <section id="about" className="border-y border-[var(--line)] bg-white/50 py-16 sm:py-20">
        <div className="site-shell grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="font-display text-3xl font-700 tracking-tight text-ink sm:text-4xl">
              Autonomous factory. Human curation.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
              Mini Apps 2.0 turns plain-English ideas into shipped software:
              spec, build, test, deploy, and register here automatically. The
              portal database is the source of truth for what the public sees —
              infrastructure can change; publication stays intentional.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-ink p-6 text-white shadow-[0_30px_80px_rgba(17,24,39,0.18)]">
            <p className="font-display text-2xl font-700 tracking-tight">
              One public place.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Discover apps, launch them in their own surface, and manage the
              ecosystem from a private admin dashboard.
            </p>
            <Link href="/apps" className="btn btn-primary mt-6">
              Open directory
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </>
  );
}
