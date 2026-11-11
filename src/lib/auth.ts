import { cookies } from "next/headers";
import {
  getAdminBootstrapEmails,
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

  // Bootstrap: first matching email becomes owner row (service or self-insert if allowed)
  const allowed = getAdminBootstrapEmails();
  if (allowed.includes(user.email.toLowerCase())) {
    await client.from("admin_users").upsert({
      id: user.id,
      email: user.email,
      display_name: user.email.split("@")[0],
      role: "owner",
    });
    return { ...user, role: "owner" };
  }
  return null;
}

export { DEMO_COOKIE };
