import { NextResponse } from "next/server";
import { getRegisterSecret } from "@/lib/env";
import { registerDeployedApp } from "@/lib/portal";
import { z } from "zod";

const BodySchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().optional(),
  live_url: z.string().url(),
  github_url: z.string().url().optional(),
  hosting_provider: z
    .enum(["vercel", "railway", "render", "cloudflare", "cursor", "other"])
    .optional(),
  publish: z.boolean().optional().default(false),
  commit_sha: z.string().optional(),
});

/**
 * Auto-registration path for the factory after a successful deploy.
 * Auth: Bearer PORTAL_REGISTER_SECRET (platform secret store).
 */
export async function POST(request: Request) {
  const secret = getRegisterSecret();
  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!secret || token !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid body" },
      { status: 400 },
    );
  }

  // Verify production URL responds
  let verified = false;
  try {
    const probe = await fetch(parsed.data.live_url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    verified = probe.ok || (probe.status >= 200 && probe.status < 500);
  } catch {
    verified = false;
  }
  if (!verified) {
    return NextResponse.json(
      { error: "live_url did not respond successfully" },
      { status: 422 },
    );
  }

  const app = await registerDeployedApp(parsed.data);

  return NextResponse.json({
    ok: true,
    app,
    portal_url: `/apps/${app.slug}`,
  });
}
