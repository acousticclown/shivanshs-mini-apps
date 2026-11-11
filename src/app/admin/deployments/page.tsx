import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { listDeployments } from "@/lib/portal";

export const metadata = { title: "Deployments" };

export default async function DeploymentsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  const deployments = await listDeployments();

  return (
    <AdminShell email={admin.email}>
      <h1 className="font-display text-3xl font-800 tracking-tight">
        Deployments
      </h1>
      <p className="mt-2 text-ink-soft">
        Status links from the deployment registry. Secrets never appear here.
      </p>
      <div className="mt-8 overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-white/70">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-paper-deep/60 text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-700">Provider</th>
              <th className="px-4 py-3 font-700">Env</th>
              <th className="px-4 py-3 font-700">Status</th>
              <th className="px-4 py-3 font-700">URL</th>
              <th className="px-4 py-3 font-700">When</th>
            </tr>
          </thead>
          <tbody>
            {deployments.map((d) => (
              <tr key={d.id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3 capitalize">{d.provider}</td>
                <td className="px-4 py-3 capitalize">{d.environment}</td>
                <td className="px-4 py-3 capitalize">{d.status}</td>
                <td className="px-4 py-3">
                  {d.url ? (
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-accent"
                    >
                      Open
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {new Date(d.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {!deployments.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-soft">
                  No deployment records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
