import { NextResponse } from "next/server";
import { listPublicApps } from "@/lib/portal";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apps = await listPublicApps({
    q: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    featured: searchParams.get("featured") === "true",
  });
  return NextResponse.json({ apps });
}
