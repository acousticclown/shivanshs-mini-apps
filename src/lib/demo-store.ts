import { randomUUID } from "crypto";
import type {
  Application,
  ApplicationInput,
  Category,
  DeploymentRecord,
  IntegrationRecord,
  SiteSettings,
} from "@/types/registry";
import {
  seedApplications,
  seedCategories,
  seedDeployments,
  seedIntegrations,
  seedSettings,
} from "@/lib/seed";

type Store = {
  settings: SiteSettings;
  categories: Category[];
  applications: Application[];
  deployments: DeploymentRecord[];
  integrations: IntegrationRecord[];
};

const globalKey = "__shivansh_mini_apps_demo_store__";

function getStore(): Store {
  const g = globalThis as typeof globalThis & { [globalKey]?: Store };
  if (!g[globalKey]) {
    g[globalKey] = {
      settings: structuredClone(seedSettings),
      categories: structuredClone(seedCategories),
      applications: structuredClone(seedApplications),
      deployments: structuredClone(seedDeployments),
      integrations: structuredClone(seedIntegrations),
    };
  }
  return g[globalKey]!;
}

function enrich(app: Application, categories: Category[]): Application {
  const cat = categories.find((c) => c.id === app.category_id);
  return {
    ...app,
    category_slug: cat?.slug ?? app.category_slug ?? null,
    category_name: cat?.name ?? app.category_name ?? null,
  };
}

export const demoStore = {
  getSettings(): SiteSettings {
    return getStore().settings;
  },
  updateSettings(patch: Partial<SiteSettings>): SiteSettings {
    const store = getStore();
    store.settings = {
      ...store.settings,
      ...patch,
      id: store.settings.id,
      updated_at: new Date().toISOString(),
    };
    return store.settings;
  },
  listCategories(): Category[] {
    return [...getStore().categories].sort(
      (a, b) => a.sort_priority - b.sort_priority,
    );
  },
  listPublicApps(opts?: {
    q?: string;
    category?: string;
    featured?: boolean;
  }): Application[] {
    const store = getStore();
    let apps = store.applications
      .filter(
        (a) =>
          a.publication_status === "published" && a.visibility === "public",
      )
      .map((a) => enrich(a, store.categories));

    if (opts?.featured) apps = apps.filter((a) => a.featured);
    if (opts?.category) {
      apps = apps.filter(
        (a) =>
          a.category_slug === opts.category || a.category_id === opts.category,
      );
    }
    if (opts?.q) {
      const q = opts.q.toLowerCase();
      apps = apps.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return apps.sort(
      (a, b) =>
        b.sort_priority - a.sort_priority ||
        a.name.localeCompare(b.name),
    );
  },
  listAllApps(): Application[] {
    const store = getStore();
    return store.applications
      .map((a) => enrich(a, store.categories))
      .sort(
        (a, b) =>
          b.sort_priority - a.sort_priority ||
          a.name.localeCompare(b.name),
      );
  },
  getAppBySlug(slug: string, { includeDraft = false } = {}): Application | null {
    const store = getStore();
    const app = store.applications.find((a) => a.slug === slug);
    if (!app) return null;
    if (
      !includeDraft &&
      (app.publication_status !== "published" || app.visibility !== "public")
    ) {
      return null;
    }
    return enrich(app, store.categories);
  },
  getAppById(id: string): Application | null {
    const store = getStore();
    const app = store.applications.find((a) => a.id === id);
    return app ? enrich(app, store.categories) : null;
  },
  createApp(input: ApplicationInput): Application {
    const store = getStore();
    const now = new Date().toISOString();
    const app: Application = {
      id: randomUUID(),
      name: input.name,
      slug: input.slug,
      description: input.description ?? "",
      short_description: input.short_description ?? "",
      icon_url: input.icon_url ?? null,
      cover_url: input.cover_url ?? null,
      category_id: input.category_id ?? null,
      tags: input.tags ?? [],
      live_url: input.live_url ?? null,
      github_url: input.github_url ?? null,
      hosting_provider: input.hosting_provider ?? "vercel",
      featured: input.featured ?? false,
      visibility: input.visibility ?? "public",
      publication_status: input.publication_status ?? "draft",
      sort_priority: input.sort_priority ?? 0,
      screenshots: input.screenshots ?? [],
      docs_url: input.docs_url ?? null,
      created_at: now,
      updated_at: now,
      published_at:
        input.publication_status === "published" ? now : null,
    };
    store.applications.push(app);
    return enrich(app, store.categories);
  },
  updateApp(id: string, input: Partial<ApplicationInput>): Application | null {
    const store = getStore();
    const idx = store.applications.findIndex((a) => a.id === id);
    if (idx < 0) return null;
    const prev = store.applications[idx];
    const next: Application = {
      ...prev,
      ...input,
      id: prev.id,
      created_at: prev.created_at,
      updated_at: new Date().toISOString(),
      published_at:
        input.publication_status === "published" && !prev.published_at
          ? new Date().toISOString()
          : prev.published_at,
    };
    store.applications[idx] = next;
    return enrich(next, store.categories);
  },
  deleteApp(id: string): boolean {
    const store = getStore();
    const before = store.applications.length;
    store.applications = store.applications.filter((a) => a.id !== id);
    // Does not delete infra — only registry row
    return store.applications.length < before;
  },
  listDeployments(): DeploymentRecord[] {
    return [...getStore().deployments].sort((a, b) =>
      b.created_at.localeCompare(a.created_at),
    );
  },
  listIntegrations(): IntegrationRecord[] {
    return [...getStore().integrations];
  },
  upsertDeployment(
    record: Omit<DeploymentRecord, "id" | "created_at" | "updated_at"> & {
      id?: string;
    },
  ): DeploymentRecord {
    const store = getStore();
    const now = new Date().toISOString();
    const row: DeploymentRecord = {
      id: record.id ?? randomUUID(),
      application_id: record.application_id,
      provider: record.provider,
      environment: record.environment,
      status: record.status,
      url: record.url ?? null,
      commit_sha: record.commit_sha ?? null,
      notes: record.notes ?? "",
      created_at: now,
      updated_at: now,
    };
    store.deployments.unshift(row);
    return row;
  },
  stats() {
    const apps = getStore().applications;
    return {
      total: apps.length,
      published: apps.filter((a) => a.publication_status === "published")
        .length,
      draft: apps.filter((a) => a.publication_status === "draft").length,
      featured: apps.filter((a) => a.featured).length,
    };
  },
};
