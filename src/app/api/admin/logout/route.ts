import { NextResponse } from "next/server";
import { DEMO_COOKIE } from "@/lib/auth";
import { hasSupabaseEnv, isDemoMode } from "@/lib/env";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const res = NextResponse.redirect(new URL("/admin/login", url.origin));
  res.cookies.set(DEMO_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });

  if (!isDemoMode() && hasSupabaseEnv()) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
  return res;
}
