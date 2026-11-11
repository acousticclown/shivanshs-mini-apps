import { createClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseEnv } from "@/lib/env";

/**
 * Cookie-free client for public reads.
 * Avoids cookies()/session work on hard refresh of marketing pages.
 */
export function createPublicClient() {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase env vars are not configured");
  }
  return createClient(getSupabaseUrl()!, getSupabaseAnonKey()!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
