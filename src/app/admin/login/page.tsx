import { redirect } from "next/navigation";
import { getAdminGate } from "@/lib/auth";
import { hasSupabaseEnv, isDemoMode } from "@/lib/env";
import { DemoLoginForm } from "./DemoLoginForm";
import { SupabaseLoginForm } from "./SupabaseLoginForm";
import { SignOutButton } from "./SignOutButton";

export const metadata = { title: "Admin login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next && params.next.startsWith("/admin")
    ? params.next
    : "/admin";

  // Only leave login when the visitor is an authorized admin.
  // A bare Supabase session must NOT bounce to /admin (that caused the loop).
  const { session, admin } = await getAdminGate();
  if (admin) redirect(next);

  const demo = isDemoMode() || !hasSupabaseEnv();
  const unauthorized =
    Boolean(session && !admin) || params.error === "unauthorized";

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
        {unauthorized && (
          <div className="mt-4 space-y-3 rounded-xl bg-orange-50 px-3 py-3 text-sm text-[var(--warn)]">
            <p>
              Signed in{session?.email ? ` as ${session.email}` : ""}, but this
              account is not an admin. Sign out and use an allowlisted email, or
              ask an owner to grant access.
            </p>
            <SignOutButton />
          </div>
        )}
        {params.error && params.error !== "unauthorized" && (
          <p className="mt-4 rounded-xl bg-orange-50 px-3 py-2 text-sm text-[var(--warn)]">
            {params.error}
          </p>
        )}
        {!unauthorized && (
          <div className="mt-6">
            {demo ? (
              <DemoLoginForm next={next} />
            ) : (
              <SupabaseLoginForm next={next} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
