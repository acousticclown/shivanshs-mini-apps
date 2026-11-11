import { redirect } from "next/navigation";
import { getSessionUser, requireAdmin } from "@/lib/auth";

/** Shared admin page gate — avoids login↔admin redirect disagreement. */
export async function requireAdminOrRedirect() {
  const admin = await requireAdmin();
  if (admin) return admin;
  const session = await getSessionUser();
  redirect(
    session ? "/admin/login?error=unauthorized" : "/admin/login",
  );
}
