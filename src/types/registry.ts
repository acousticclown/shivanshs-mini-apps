import { z } from "zod";

export const PublicationStatus = z.enum([
  "draft",
  "published",
  "archived",
  "hidden",
]);
export type PublicationStatus = z.infer<typeof PublicationStatus>;

export const Visibility = z.enum(["public", "unlisted", "private"]);
export type Visibility = z.infer<typeof Visibility>;

export const HostingProvider = z.enum([
  "vercel",
  "railway",
  "render",
  "cloudflare",
  "cursor",
  "other",
]);
export type HostingProvider = z.infer<typeof HostingProvider>;

export const ApplicationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(120),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(2000).default(""),
  short_description: z.string().max(240).default(""),
  icon_url: z.string().url().nullable().optional(),
  cover_url: z.string().url().nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  category_slug: z.string().nullable().optional(),
  category_name: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  live_url: z.string().url().nullable().optional(),
  github_url: z.string().url().nullable().optional(),
  hosting_provider: HostingProvider.default("vercel"),
  featured: z.boolean().default(false),
  visibility: Visibility.default("public"),
  publication_status: PublicationStatus.default("draft"),
  sort_priority: z.number().int().default(0),
  screenshots: z.array(z.string().url()).default([]),
  docs_url: z.string().url().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  published_at: z.string().nullable().optional(),
});
export type Application = z.infer<typeof ApplicationSchema>;

export const ApplicationInputSchema = ApplicationSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  category_slug: true,
  category_name: true,
}).partial({
  description: true,
  short_description: true,
  tags: true,
  screenshots: true,
  featured: true,
  visibility: true,
  publication_status: true,
  sort_priority: true,
  hosting_provider: true,
});
export type ApplicationInput = z.infer<typeof ApplicationInputSchema>;

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().default(""),
  sort_priority: z.number().int().default(0),
});
export type Category = z.infer<typeof CategorySchema>;

export const SiteSettingsSchema = z.object({
  id: z.string().uuid(),
  brand_name: z.string().default("Shivansh's Mini Apps"),
  tagline: z.string().default("Personal software, shipped."),
  intro: z
    .string()
    .default(
      "A living directory of mini apps built, tested, and maintained by an autonomous factory — curated by Shivansh Pratap.",
    ),
  logo_url: z.string().url().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  primary_cta_label: z.string().default("Browse apps"),
  primary_cta_href: z.string().default("/apps"),
  secondary_cta_label: z.string().default("About"),
  secondary_cta_href: z.string().default("/#about"),
  footer_text: z.string().default("Built with Mini Apps 2.0"),
  social_links: z
    .array(z.object({ label: z.string(), href: z.string().url() }))
    .default([]),
  theme: z
    .object({
      accent: z.string().default("#0F766E"),
      ink: z.string().default("#111827"),
    })
    .default({ accent: "#0F766E", ink: "#111827" }),
  updated_at: z.string(),
});
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;

export const DeploymentRecordSchema = z.object({
  id: z.string().uuid(),
  application_id: z.string().uuid().nullable(),
  provider: HostingProvider,
  environment: z.enum(["preview", "production"]).default("production"),
  status: z.enum(["pending", "building", "ready", "error", "cancelled"]),
  url: z.string().url().nullable().optional(),
  commit_sha: z.string().nullable().optional(),
  notes: z.string().default(""),
  created_at: z.string(),
  updated_at: z.string(),
});
export type DeploymentRecord = z.infer<typeof DeploymentRecordSchema>;

export const IntegrationRecordSchema = z.object({
  id: z.string().uuid(),
  provider: z.string(),
  status: z.enum(["connected", "pending", "error", "disconnected"]),
  project_ref: z.string().nullable().optional(),
  last_checked_at: z.string().nullable().optional(),
  notes: z.string().default(""),
});
export type IntegrationRecord = z.infer<typeof IntegrationRecordSchema>;

export const AdminUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  display_name: z.string().default(""),
  role: z.enum(["owner", "admin"]).default("admin"),
  created_at: z.string(),
});
export type AdminUser = z.infer<typeof AdminUserSchema>;
