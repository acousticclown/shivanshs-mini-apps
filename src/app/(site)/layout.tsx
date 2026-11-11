import { NavProgress } from "@/components/portal/NavProgress";

/**
 * Shared public-site shell. Intentionally sync / no data fetching so
 * soft navigations can swap page content behind loading.tsx immediately
 * without waiting on a blocking layout.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavProgress />
      {children}
    </>
  );
}
