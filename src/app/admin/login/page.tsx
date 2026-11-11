import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { hasSupabaseEnv, isDemoMode } from "@/lib/env";
import { DemoLoginForm } from "./DemoLoginForm";
import { SupabaseLoginForm } from "./SupabaseLoginForm";

export const metadata = { title: "Admin login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const user = await getSessionUser();
  if (user) redirect(params.next || "/admin");

  const demo = isDemoMode() || !hasSupabaseEnv();

  return (
    <div className="site-shell flex min-h-screen items-center justify-center py-16">
      <div className="w-full max-w-md rounded-[1.75rem] border border-[var(--line)] bg-white/80 p-8 shadow-[0_30px_80px_rgba(17,24,39,0.08)]">
        <p className="font-display text-3xl font-800 tracking-tight text-ink">
          Admin access
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Authorized operators only. Portal DB controls publication — not
          infrastructure teardown.
        </p>
        {params.error && (
          <p className="mt-4 rounded-xl bg-orange-50 px-3 py-2 text-sm text-[var(--warn)]">
            {params.error}
          </p>
        )}
        <div className="mt-6">
          {demo ? (
            <DemoLoginForm next={params.next || "/admin"} />
          ) : (
            <SupabaseLoginForm next={params.next || "/admin"} />
          )}
        </div>
      </div>
    </div>
  );
}
