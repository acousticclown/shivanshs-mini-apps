import { AdminShell } from "@/components/admin/AdminShell";
import { AppForm } from "@/components/admin/AppForm";
import { requireAdminOrRedirect } from "@/lib/admin-guard";
import { listCategories } from "@/lib/portal";

export const metadata = { title: "New app" };

export default async function NewAppPage() {
  const admin = await requireAdminOrRedirect();
  const categories = await listCategories();

  return (
    <AdminShell email={admin.email}>
      <h1 className="font-display text-3xl font-800 tracking-tight">New app</h1>
      <div className="mt-8 max-w-3xl rounded-[1.25rem] border border-[var(--line)] bg-white/70 p-6">
        <AppForm categories={categories} />
      </div>
    </AdminShell>
  );
}
