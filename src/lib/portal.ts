import { demoStore } from "@/lib/demo-store";
import { hasSupabaseEnv, isDemoMode } from "@/lib/env";
import type {
  Application,
  ApplicationInput,
  Category,
  DeploymentRecord,
  IntegrationRecord,
  SiteSettings,
} from "@/types/registry";

/** Public/catalog reads — no cookies, safe on hard refresh. */
async function supabaseClient() {
  const { createPublicClient } = await import("@/lib/supabase/public");
  return createPublicClient();
}

/** Authenticated admin mutations — cookie session. */
async function supabaseAuthedClient() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

function mapApp(row: Record<string, unknown>, tags: string[] = []): Application {
  const category = row.application_categories as
    | { id: string; name: string; slug: string }
    | null
    | undefined;
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    short_description: String(row.short_description ?? ""),
    icon_url: (row.icon_url as string | null) ?? null,
    cover_url: (row.cover_url as string | null) ?? null,
    category_id: (row.category_id as string | null) ?? category?.id ?? null,
    category_slug: category?.slug ?? null,
    category_name: category?.name ?? null,
    tags,
    live_url: (row.live_url as string | null) ?? null,
    github_url: (row.github_url as string | null) ?? null,
    hosting_provider: (row.hosting_provider as Application["hosting_provider"]) ?? "vercel",
    featured: Boolean(row.featured),
    visibility: (row.visibility as Application["visibility"]) ?? "public",
    publication_status:
      (row.publication_status as Application["publication_status"]) ?? "draft",
    sort_priority: Number(row.sort_priority ?? 0),
    screenshots: Array.isArray(row.screenshots)
      ? (row.screenshots as string[])
      : [],
    docs_url: (row.docs_url as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    published_at: (row.published_at as string | null) ?? null,
  };
}

async function loadTags(
  client: Awaited<ReturnType<typeof supabaseClient>>,
  appIds: string[],
): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (!appIds.length) return map;
  const { data } = await client
    .from("application_tag_relations")
    .select("application_id, application_tags(slug)")
    .in("application_id", appIds);
  for (const row of data ?? []) {
    const id = row.application_id as string;
    const slug = (row.application_tags as { slug?: string } | null)?.slug;
    if (!slug) continue;
    const list = map.get(id) ?? [];
    list.push(slug);
    map.set(id, list);
  }
  return map;
}

export async function getSettings(): Promise<SiteSettings> {
  if (isDemoMode() || !hasSupabaseEnv()) return demoStore.getSettings();
  const client = await supabaseClient();
  const { data, error } = await client
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error || !data) return demoStore.getSettings();
  return {
    id: data.id,
    brand_name: data.brand_name,
    tagline: data.tagline,
    intro: data.intro,
    logo_url: data.logo_url,
    avatar_url: data.avatar_url,
    primary_cta_label: data.primary_cta_label,
    primary_cta_href: data.primary_cta_href,
    secondary_cta_label: data.secondary_cta_label,
    secondary_cta_href: data.secondary_cta_href,
    footer_text: data.footer_text,
    social_links: data.social_links ?? [],
    theme: data.theme ?? { accent: "#0F766E", ink: "#111827" },
    updated_at: data.updated_at,
  };
}

export async function updateSettings(
  patch: Partial<SiteSettings>,
): Promise<SiteSettings> {
  if (isDemoMode() || !hasSupabaseEnv()) return demoStore.updateSettings(patch);
  const client = await supabaseAuthedClient();
  const current = await getSettings();
  const { data, error } = await client
    .from("site_settings")
    .update({
      brand_name: patch.brand_name ?? current.brand_name,
      tagline: patch.tagline ?? current.tagline,
      intro: patch.intro ?? current.intro,
      logo_url: patch.logo_url ?? current.logo_url,
      avatar_url: patch.avatar_url ?? current.avatar_url,
      primary_cta_label: patch.primary_cta_label ?? current.primary_cta_label,
      primary_cta_href: patch.primary_cta_href ?? current.primary_cta_href,
      secondary_cta_label:
        patch.secondary_cta_label ?? current.secondary_cta_label,
      secondary_cta_href:
        patch.secondary_cta_href ?? current.secondary_cta_href,
      footer_text: patch.footer_text ?? current.footer_text,
      social_links: patch.social_links ?? current.social_links,
      theme: patch.theme ?? current.theme,
    })
    .eq("id", current.id)
    .select("*")
    .single();
  if (error) throw error;
  return {
    id: data.id,
    brand_name: data.brand_name,
    tagline: data.tagline,
    intro: data.intro,
    logo_url: data.logo_url,
    avatar_url: data.avatar_url,
    primary_cta_label: data.primary_cta_label,
    primary_cta_href: data.primary_cta_href,
    secondary_cta_label: data.secondary_cta_label,
    secondary_cta_href: data.secondary_cta_href,
    footer_text: data.footer_text,
    social_links: data.social_links ?? [],
    theme: data.theme ?? { accent: "#0F766E", ink: "#111827" },
    updated_at: data.updated_at,
  };
}

export async function listCategories(): Promise<Category[]> {
  if (isDemoMode() || !hasSupabaseEnv()) return demoStore.listCategories();
  const client = await supabaseClient();
  const { data } = await client
    .from("application_categories")
    .select("*")
    .order("sort_priority");
  return (data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    sort_priority: c.sort_priority ?? 0,
  }));
}

export async function listPublicApps(opts?: {
  q?: string;
  category?: string;
  featured?: boolean;
}): Promise<Application[]> {
  if (isDemoMode() || !hasSupabaseEnv()) return demoStore.listPublicApps(opts);
  const client = await supabaseClient();
  let query = client
    .from("applications")
    .select("*, application_categories(id,name,slug)")
    .eq("publication_status", "published")
    .eq("visibility", "public")
    .order("sort_priority", { ascending: false });
  if (opts?.featured) query = query.eq("featured", true);
  const { data } = await query;
  let apps = data ?? [];
  if (opts?.category) {
    apps = apps.filter(
      (a) =>
        (a.application_categories as { slug?: string } | null)?.slug ===
          opts.category || a.category_id === opts.category,
    );
  }
  const tagMap = await loadTags(
    client,
    apps.map((a) => a.id as string),
  );
  let mapped = apps.map((a) => mapApp(a, tagMap.get(a.id) ?? []));
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    mapped = mapped.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  return mapped;
}

export async function listAllApps(): Promise<Application[]> {
  if (isDemoMode() || !hasSupabaseEnv()) return demoStore.listAllApps();
  const client = await supabaseAuthedClient();
  const { data } = await client
    .from("applications")
    .select("*, application_categories(id,name,slug)")
    .order("sort_priority", { ascending: false });
  const apps = data ?? [];
  const tagMap = await loadTags(
    client,
    apps.map((a) => a.id as string),
  );
  return apps.map((a) => mapApp(a, tagMap.get(a.id) ?? []));
}

export async function getAppBySlug(
  slug: string,
  opts?: { includeDraft?: boolean },
): Promise<Application | null> {
  if (isDemoMode() || !hasSupabaseEnv())
    return demoStore.getAppBySlug(slug, opts);
  const client = opts?.includeDraft
    ? await supabaseAuthedClient()
    : await supabaseClient();
  const { data } = await client
    .from("applications")
    .select("*, application_categories(id,name,slug)")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return null;
  if (
    !opts?.includeDraft &&
    (data.publication_status !== "published" || data.visibility !== "public")
  ) {
    return null;
  }
  const tagMap = await loadTags(client, [data.id]);
  return mapApp(data, tagMap.get(data.id) ?? []);
}

export async function getAppById(id: string): Promise<Application | null> {
  if (isDemoMode() || !hasSupabaseEnv()) return demoStore.getAppById(id);
  const client = await supabaseAuthedClient();
  const { data } = await client
    .from("applications")
    .select("*, application_categories(id,name,slug)")
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  const tagMap = await loadTags(client, [data.id]);
  return mapApp(data, tagMap.get(data.id) ?? []);
}

export async function createApp(input: ApplicationInput): Promise<Application> {
  if (isDemoMode() || !hasSupabaseEnv()) return demoStore.createApp(input);
  const client = await supabaseAuthedClient();
  const { data, error } = await client
    .from("applications")
    .insert({
      name: input.name,
      slug: input.slug,
      description: input.description ?? "",
      short_description: input.short_description ?? "",
      icon_url: input.icon_url ?? null,
      cover_url: input.cover_url ?? null,
      category_id: input.category_id ?? null,
      live_url: input.live_url ?? null,
      github_url: input.github_url ?? null,
      hosting_provider: input.hosting_provider ?? "vercel",
      featured: input.featured ?? false,
      visibility: input.visibility ?? "public",
      publication_status: input.publication_status ?? "draft",
      sort_priority: input.sort_priority ?? 0,
      screenshots: input.screenshots ?? [],
      docs_url: input.docs_url ?? null,
      published_at:
        input.publication_status === "published"
          ? new Date().toISOString()
          : null,
    })
    .select("*, application_categories(id,name,slug)")
    .single();
  if (error) throw error;
  if (input.tags?.length) {
    await syncTags(client, data.id, input.tags);
  }
  return (await getAppById(data.id))!;
}

export async function updateApp(
  id: string,
  input: Partial<ApplicationInput>,
): Promise<Application | null> {
  if (isDemoMode() || !hasSupabaseEnv()) return demoStore.updateApp(id, input);
  const client = await supabaseAuthedClient();
  const patch: Record<string, unknown> = { ...input };
  delete patch.tags;
  if (input.publication_status === "published") {
    patch.published_at = new Date().toISOString();
  }
  const { error } = await client.from("applications").update(patch).eq("id", id);
  if (error) throw error;
  if (input.tags) await syncTags(client, id, input.tags);
  return getAppById(id);
}

export async function deleteApp(id: string): Promise<boolean> {
  if (isDemoMode() || !hasSupabaseEnv()) return demoStore.deleteApp(id);
  const client = await supabaseAuthedClient();
  // Registry delete only — never tears down hosting infra
  const { error } = await client.from("applications").delete().eq("id", id);
  return !error;
}

async function syncTags(
  client: Awaited<ReturnType<typeof supabaseAuthedClient>>,
  applicationId: string,
  tags: string[],
) {
  await client
    .from("application_tag_relations")
    .delete()
    .eq("application_id", applicationId);
  for (const raw of tags) {
    const slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const name = raw;
    const { data: tag } = await client
      .from("application_tags")
      .upsert({ slug, name }, { onConflict: "slug" })
      .select("id")
      .single();
    if (tag?.id) {
      await client.from("application_tag_relations").insert({
        application_id: applicationId,
        tag_id: tag.id,
      });
    }
  }
}

export async function listDeployments(): Promise<DeploymentRecord[]> {
  if (isDemoMode() || !hasSupabaseEnv()) return demoStore.listDeployments();
  const client = await supabaseAuthedClient();
  const { data } = await client
    .from("deployment_records")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as DeploymentRecord[];
}

export async function listIntegrations(): Promise<IntegrationRecord[]> {
  if (isDemoMode() || !hasSupabaseEnv()) return demoStore.listIntegrations();
  const client = await supabaseAuthedClient();
  const { data } = await client.from("integration_records").select("*");
  return (data ?? []) as IntegrationRecord[];
}

export async function getStats() {
  if (isDemoMode() || !hasSupabaseEnv()) return demoStore.stats();
  const apps = await listAllApps();
  return {
    total: apps.length,
    published: apps.filter((a) => a.publication_status === "published").length,
    draft: apps.filter((a) => a.publication_status === "draft").length,
    featured: apps.filter((a) => a.featured).length,
  };
}

export async function registerDeployedApp(input: {
  name: string;
  slug: string;
  description?: string;
  live_url: string;
  github_url?: string;
  hosting_provider?: Application["hosting_provider"];
  publish?: boolean;
}): Promise<Application> {
  if (isDemoMode() || !hasSupabaseEnv()) {
    const existing = demoStore.getAppBySlug(input.slug, { includeDraft: true });
    if (existing) {
      return (
        demoStore.updateApp(existing.id, {
          live_url: input.live_url,
          github_url: input.github_url,
          description: input.description ?? existing.description,
          hosting_provider: input.hosting_provider,
          publication_status: input.publish
            ? "published"
            : existing.publication_status,
          visibility: input.publish ? "public" : existing.visibility,
        }) ?? existing
      );
    }
    return demoStore.createApp({
      name: input.name,
      slug: input.slug,
      description: input.description ?? "",
      short_description: input.description?.slice(0, 240) ?? "",
      live_url: input.live_url,
      github_url: input.github_url,
      hosting_provider: input.hosting_provider ?? "vercel",
      publication_status: input.publish ? "published" : "draft",
      visibility: input.publish ? "public" : "private",
      featured: false,
      sort_priority: 0,
      tags: [],
      screenshots: [],
    });
  }

  // Factory path uses the service role (no browser session).
  const { createServiceClient } = await import("@/lib/supabase/admin");
  const client = createServiceClient();
  const { data: existing } = await client
    .from("applications")
    .select("*, application_categories(id,name,slug)")
    .eq("slug", input.slug)
    .maybeSingle();

  const payload = {
    name: input.name,
    slug: input.slug,
    description: input.description ?? existing?.description ?? "",
    short_description:
      (input.description ?? existing?.short_description ?? "").slice(0, 240),
    live_url: input.live_url,
    github_url: input.github_url ?? existing?.github_url ?? null,
    hosting_provider:
      input.hosting_provider ?? existing?.hosting_provider ?? "vercel",
    publication_status: input.publish
      ? "published"
      : (existing?.publication_status ?? "draft"),
    visibility: input.publish ? "public" : (existing?.visibility ?? "private"),
    featured: existing?.featured ?? false,
    sort_priority: existing?.sort_priority ?? 0,
    published_at: input.publish
      ? new Date().toISOString()
      : (existing?.published_at ?? null),
  };

  const { data, error } = await client
    .from("applications")
    .upsert(payload, { onConflict: "slug" })
    .select("*, application_categories(id,name,slug)")
    .single();
  if (error) throw error;

  await client.from("deployment_records").insert({
    application_id: data.id,
    provider: payload.hosting_provider,
    environment: "production",
    status: "ready",
    url: input.live_url,
    notes: "Auto-registered via /api/admin/register",
  });

  return mapApp(data, []);
}
