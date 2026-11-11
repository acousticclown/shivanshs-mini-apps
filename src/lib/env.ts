export function getSupabaseUrl(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    undefined
  );
}

export function getSupabaseAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    undefined
  );
}

export function getSupabaseServiceKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || undefined;
}

export function hasSupabaseEnv(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

/** Demo store when Supabase is not configured — local/preview only. */
export function isDemoMode(): boolean {
  if (process.env.PORTAL_DEMO_MODE === "true") return true;
  if (process.env.PORTAL_DEMO_MODE === "false") return false;
  return !hasSupabaseEnv();
}

export function getAdminBootstrapEmails(): string[] {
  const raw =
    process.env.ADMIN_BOOTSTRAP_EMAILS ||
    process.env.NEXT_PUBLIC_ADMIN_BOOTSTRAP_EMAILS ||
    "shivanshsuryavanshi@gmail.com";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function getRegisterSecret(): string | undefined {
  return process.env.PORTAL_REGISTER_SECRET || undefined;
}
