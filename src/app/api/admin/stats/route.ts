import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStats } from "@/lib/portal";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getStats());
}
