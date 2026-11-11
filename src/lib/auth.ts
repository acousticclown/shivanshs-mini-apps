import { cookies } from "next/headers";
import {
  getAdminBootstrapEmails,
  getSupabaseServiceKey,
  hasSupabaseEnv,
  isDemoMode,
} from "@/lib/env";

const DEMO_COOKIE = "portal_demo_admin";

export async function getSessionUser(): Promise<{
  email: string;
  id: string;
  demo?: boolean;
} | null> {
  if (isDemoMode() || !hasSupabaseEnv()) {
    const jar = await cookies();
    const email = jar.get(DEMO_COOKIE)?.value;
    if (!email) return null;
    return { email, id: "demo-admin", demo: true };
  }

  const { createClient } = await import("@/lib/supabase/server");
  const client = await createClient();
  const { data } = await client.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub || !claims.email) return null;
  return {
    id: String(claims.sub),
    email: String(claims.email).toLowerCase(),
  };
}

async function bootstrapAdmin(user: { id: string; email: string }) {
  const allowed = getAdminBootstrapEmails();
  if (!allowed.includes(user.email.toLowerCase())) return null;

  const row = {
    id: user.id,
    email: user.email,
    display_name: user.email.split("@")[0] || user.email,
    role: "owner" as const,
  };

  // Prefer service role so the first owner can be created despite RLS
  // (owner-only write policy otherwise deadlocks bootstrap).
  if (getSupabaseServiceKey()) {
    try {
      const { createServiceClient } = await import("@/lib/supabase/admin");
      const service = createServiceClient();
      const { error } = await service.from("admin_users").upsert(row);
      if (!error) return { ...user, role: "owner" };
    } catch {
      // fall through to session client
    }
  }

  const { createClient } = await import("@/lib/supabase/server");
  const client = await createClient();
  const { error } = await client.from("admin_users").upsert(row);
  if (error) return null;
  return { ...user, role: "owner" };
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) return null;

  if (user.demo) {
    const allowed = getAdminBootstrapEmails();
    if (!allowed.includes(user.email.toLowerCase())) return null;
    return user;
  }

  if (!hasSupabaseEnv()) return null;
  const { createClient } = await import("@/lib/supabase/server");
  const client = await createClient();
  const { data: admin } = await client
    .from("admin_users")
    .select("id, email, role")
    .eq("id", user.id)
    .maybeSingle();

  if (admin) return { ...user, role: admin.role as string };

  return bootstrapAdmin(user);
}

/** Login page helper: only auto-advance when the user is a real admin. */
export async function getAdminGate(): Promise<{
  session: Awaited<ReturnType<typeof getSessionUser>>;
  admin: Awaited<ReturnType<typeof requireAdmin>>;
}> {
  const session = await getSessionUser();
  if (!session) return { session: null, admin: null };
  const admin = await requireAdmin();
  return { session, admin };
}

export { DEMO_COOKIE };
