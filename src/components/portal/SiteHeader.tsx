import Link from "next/link";
import type { SiteSettings } from "@/types/registry";

export function SiteHeader({
  settings,
  tone = "light",
}: {
  settings: SiteSettings;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <header className="site-shell flex items-center justify-between gap-6 py-5">
      <Link href="/" className="group flex items-center gap-3">
        <span
          className={`grid h-10 w-10 place-items-center rounded-2xl font-display text-lg font-800 tracking-tight ${
            dark ? "bg-white/15 text-white" : "bg-ink text-white"
          }`}
          aria-hidden
        >
          S
        </span>
        <span
          className={`font-display text-lg font-700 tracking-tight sm:text-xl ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          {settings.brand_name}
        </span>
      </Link>
      <nav className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/apps"
          className={`text-sm font-semibold ${
            dark ? "text-white/85 hover:text-white" : "text-ink-soft hover:text-ink"
          }`}
        >
          Directory
        </Link>
        <Link
          href="/admin"
          className={`hidden text-sm font-semibold sm:inline ${
            dark ? "text-white/70 hover:text-white" : "text-ink-soft hover:text-ink"
          }`}
        >
          Admin
        </Link>
        <Link
          href={settings.primary_cta_href || "/apps"}
          className={`btn text-sm ${dark ? "btn-ghost" : "btn-primary"}`}
        >
          {settings.primary_cta_label || "Browse apps"}
        </Link>
      </nav>
    </header>
  );
}
