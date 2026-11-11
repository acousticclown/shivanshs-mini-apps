import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AppForm } from "@/components/admin/AppForm";
import { requireAdmin } from "@/lib/auth";
import { getAppById, listCategories } from "@/lib/portal";

export const metadata = { title: "Edit app" };

export default async function EditAppPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  const { id } = await params;
  const [app, categories] = await Promise.all([
    getAppById(id),
    listCategories(),
  ]);
  if (!app) notFound();

  return (
    <AdminShell email={admin.email}>
      <h1 className="font-display text-3xl font-800 tracking-tight">
        Edit · {app.name}
      </h1>
      <div className="mt-8 max-w-3xl rounded-[1.25rem] border border-[var(--line)] bg-white/70 p-6">
        <AppForm categories={categories} initial={app} />
      </div>
    </AdminShell>
  );
}
