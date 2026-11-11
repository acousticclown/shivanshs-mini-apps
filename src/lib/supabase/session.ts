import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseEnv } from "@/lib/env";

function needsAuthRefresh(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api/admin")
  );
}

/**
 * Refresh Supabase auth cookies on auth-related routes only.
 * Public pages skip getClaims() so hard refreshes stay fast and stable.
 * Routing decisions stay in page-level requireAdmin/login (no proxy redirects).
 */
export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let supabaseResponse = NextResponse.next({ request });

  if (!hasSupabaseEnv() || !needsAuthRefresh(pathname)) {
    return supabaseResponse;
  }

  const supabase = createServerClient(getSupabaseUrl()!, getSupabaseAnonKey()!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  try {
    await supabase.auth.getClaims();
  } catch {
    // Never fail the document request because session refresh hiccuped.
  }

  return supabaseResponse;
}
