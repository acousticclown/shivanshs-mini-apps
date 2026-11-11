import Link from "next/link";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/apps", label: "Apps" },
  { href: "/admin/settings", label: "Portal settings" },
  { href: "/admin/deployments", label: "Deployments" },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-white/70 backdrop-blur">
        <div className="site-shell flex flex-wrap items-center justify-between gap-4 py-4">
          <div>
            <p className="font-display text-lg font-700 tracking-tight text-ink">
              Admin · Shivansh&apos;s Mini Apps
            </p>
            <p className="text-xs text-ink-soft">{email}</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full bg-paper-deep px-3 py-1.5 text-xs font-700 uppercase tracking-wide text-ink-soft hover:bg-ink hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/"
              className="rounded-full px-3 py-1.5 text-xs font-700 uppercase tracking-wide text-accent"
            >
              Public site
            </Link>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="rounded-full px-3 py-1.5 text-xs font-700 uppercase tracking-wide text-ink-soft hover:text-ink"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="site-shell py-8 sm:py-10">{children}</main>
    </div>
  );
}
