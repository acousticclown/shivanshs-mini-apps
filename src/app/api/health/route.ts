import { NextResponse } from "next/server";
import { hasSupabaseEnv, isDemoMode } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    ok: true,
    brand: "Shivansh's Mini Apps",
    mode: isDemoMode() || !hasSupabaseEnv() ? "demo" : "supabase",
    time: new Date().toISOString(),
  });
}
