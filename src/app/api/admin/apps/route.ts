import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createApp, listAllApps } from "@/lib/portal";
import { ApplicationInputSchema } from "@/types/registry";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const apps = await listAllApps();
  return NextResponse.json({ apps });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const parsed = ApplicationInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 },
    );
  }
  try {
    const app = await createApp(parsed.data);
    return NextResponse.json(app, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Create failed" },
      { status: 500 },
    );
  }
}
