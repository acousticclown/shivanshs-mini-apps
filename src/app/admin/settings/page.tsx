import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdminOrRedirect } from "@/lib/admin-guard";
import { getSettings } from "@/lib/portal";

export const metadata = { title: "Portal settings" };

export default async function AdminSettingsPage() {
  const admin = await requireAdminOrRedirect();
  const settings = await getSettings();

  return (
    <AdminShell email={admin.email}>
      <h1 className="font-display text-3xl font-800 tracking-tight">
        Portal customization
      </h1>
      <p className="mt-2 text-ink-soft">
        Saved to the portal database and reflected on the public site.
      </p>
      <div className="mt-8 max-w-3xl rounded-[1.25rem] border border-[var(--line)] bg-white/70 p-6">
        <SettingsForm initial={settings} />
      </div>
    </AdminShell>
  );
}
