import Link from "next/link";
import type { SiteSettings } from "@/types/registry";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-auto border-t border-[var(--line)] py-10">
      <div className="site-shell flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-lg font-700 tracking-tight text-ink">
            {settings.brand_name}
          </p>
          <p className="mt-1 max-w-md text-sm text-ink-soft">
            {settings.footer_text}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-ink-soft">
          <Link href="/apps" className="hover:text-ink">
            Apps
          </Link>
          <Link href="/#about" className="hover:text-ink">
            About
          </Link>
          <Link href="/admin" className="hover:text-ink">
            Admin
          </Link>
          {settings.social_links?.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
