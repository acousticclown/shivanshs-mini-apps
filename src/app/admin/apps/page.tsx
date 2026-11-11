import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminOrRedirect } from "@/lib/admin-guard";
import { listAllApps } from "@/lib/portal";

export const metadata = { title: "Manage apps" };

export default async function AdminAppsPage() {
  const admin = await requireAdminOrRedirect();
  const apps = await listAllApps();

  return (
    <AdminShell email={admin.email}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-800 tracking-tight text-ink">
            Apps
          </h1>
          <p className="mt-2 text-ink-soft">
            CRUD for registry metadata. Record delete ≠ infra delete.
          </p>
        </div>
        <Link href="/admin/apps/new" className="btn btn-primary">
          New app
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-white/70">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-paper-deep/60 text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-700">Name</th>
              <th className="px-4 py-3 font-700">Status</th>
              <th className="hidden px-4 py-3 font-700 sm:table-cell">
                Category
              </th>
              <th className="px-4 py-3 font-700">Featured</th>
              <th className="px-4 py-3 font-700"></th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app.id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3">
                  <div className="font-semibold">{app.name}</div>
                  <div className="text-xs text-ink-soft">/{app.slug}</div>
                </td>
                <td className="px-4 py-3 capitalize">{app.publication_status}</td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  {app.category_name || "—"}
                </td>
                <td className="px-4 py-3">{app.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/apps/${app.id}`}
                    className="font-700 text-accent hover:text-accent-deep"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
