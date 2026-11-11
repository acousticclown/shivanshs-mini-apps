import { createClient } from "@supabase/supabase-js";
import {
  getSupabaseServiceKey,
  getSupabaseUrl,
  hasSupabaseEnv,
} from "@/lib/env";

/** Service-role client for trusted server paths (auto-register, migrations helpers). */
export function createServiceClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseServiceKey();
  if (!url || !key || !hasSupabaseEnv()) {
    throw new Error("Supabase service credentials are not configured");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
