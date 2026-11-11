import { NextResponse } from "next/server";
import { DEMO_COOKIE } from "@/lib/auth";
import { getAdminBootstrapEmails, isDemoMode, hasSupabaseEnv } from "@/lib/env";

export async function POST(request: Request) {
  if (!isDemoMode() && hasSupabaseEnv()) {
    return NextResponse.json(
      { error: "Demo login disabled when Supabase is configured" },
      { status: 400 },
    );
  }
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const next = String(body.next || "/admin");
  if (!getAdminBootstrapEmails().includes(email)) {
    return NextResponse.json(
      { error: "Email is not in ADMIN_BOOTSTRAP_EMAILS" },
      { status: 403 },
    );
  }
  const res = NextResponse.json({ ok: true, redirect: next });
  res.cookies.set(DEMO_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
