import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Auth cookie refresh only where sessions matter.
     * Public marketing routes are intentionally excluded for speed + hard-refresh stability.
     */
    "/admin/:path*",
    "/auth/:path*",
    "/api/admin/:path*",
  ],
};
