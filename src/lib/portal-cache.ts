import { unstable_cache } from "next/cache";
import {
  getAppBySlug,
  getSettings,
  listCategories,
  listPublicApps,
} from "@/lib/portal";

/** Cached public reads — keeps soft navigations from waiting on cold Supabase. */
export const getSettingsCached = unstable_cache(
  async () => getSettings(),
  ["portal-settings"],
  { revalidate: 60, tags: ["portal-settings"] },
);

export const listCategoriesCached = unstable_cache(
  async () => listCategories(),
  ["portal-categories"],
  { revalidate: 60, tags: ["portal-categories"] },
);

export const listPublicAppsCached = unstable_cache(
  async (opts?: { q?: string; category?: string; featured?: boolean }) =>
    listPublicApps(opts),
  ["portal-apps"],
  { revalidate: 60, tags: ["portal-apps"] },
);

export const getAppBySlugCached = unstable_cache(
  async (slug: string) => getAppBySlug(slug),
  ["portal-app-by-slug"],
  { revalidate: 60, tags: ["portal-apps"] },
);
