import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getStats, listIntegrations, listPublicApps } from "@/lib/portal";
import { hasSupabaseEnv, isDemoMode } from "@/lib/env";

export const metadata = { title: "Admin" };

export default async function AdminHomePage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const [stats, integrations, published] = await Promise.all([
    getStats(),
    listIntegrations(),
    listPublicApps(),
  ]);

  return (
    <AdminShell email={admin.email}>
      <h1 className="font-display text-3xl font-800 tracking-tight text-ink sm:text-4xl">
        Overview
      </h1>
      <p className="mt-2 text-ink-soft">
        Portal registry health. Deleting an app record never deletes hosting
        infra.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total apps", value: stats.total },
          { label: "Published", value: stats.published },
          { label: "Drafts", value: stats.draft },
          { label: "Featured", value: stats.featured },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[1.25rem] border border-[var(--line)] bg-white/70 p-5"
          >
            <p className="text-xs font-700 uppercase tracking-wide text-ink-soft">
              {s.label}
            </p>
            <p className="mt-2 font-display text-4xl font-800 text-ink">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[1.25rem] border border-[var(--line)] bg-white/70 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-700">Integrations</h2>
            <span className="text-xs font-semibold text-ink-soft">
              {isDemoMode() || !hasSupabaseEnv() ? "Demo data mode" : "Live DB"}
            </span>
          </div>
          <ul className="mt-4 space-y-3">
            {integrations.map((i) => (
              <li
                key={i.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="font-semibold capitalize">{i.provider}</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-700 uppercase ${
                    i.status === "connected"
                      ? "bg-accent-soft text-accent-deep"
                      : "bg-paper-deep text-ink-soft"
                  }`}
                >
                  {i.status}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink-soft">
            Secrets are never shown here — only connection health.
          </p>
        </section>

        <section className="rounded-[1.25rem] border border-[var(--line)] bg-white/70 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-700">Published now</h2>
            <Link href="/admin/apps" className="text-sm font-700 text-accent">
              Manage →
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {published.slice(0, 6).map((app) => (
              <li key={app.id} className="flex items-center justify-between gap-3 text-sm">
                <Link
                  href={`/admin/apps/${app.id}`}
                  className="font-semibold hover:text-accent"
                >
                  {app.name}
                </Link>
                {app.live_url ? (
                  <a
                    href={app.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-soft hover:text-ink"
                  >
                    Live
                  </a>
                ) : (
                  <span className="text-ink-soft">No URL</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}
