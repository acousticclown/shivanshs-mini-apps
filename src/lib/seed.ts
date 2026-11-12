import type {
  Application,
  Category,
  DeploymentRecord,
  IntegrationRecord,
  SiteSettings,
} from "@/types/registry";

const now = "2026-11-11T12:00:00.000Z";

export const seedCategories: Category[] = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    name: "Productivity",
    slug: "productivity",
    description: "Tools that sharpen focus and flow.",
    sort_priority: 10,
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    name: "Creative",
    slug: "creative",
    description: "Sketch, remix, and make.",
    sort_priority: 20,
  },
  {
    id: "11111111-1111-4111-8111-111111111103",
    name: "Utilities",
    slug: "utilities",
    description: "Small sharp tools for everyday tasks.",
    sort_priority: 30,
  },
  {
    id: "11111111-1111-4111-8111-111111111104",
    name: "Experiments",
    slug: "experiments",
    description: "Prototypes and playful R&D.",
    sort_priority: 40,
  },
];

export const seedSettings: SiteSettings = {
  id: "22222222-2222-4222-8222-222222222201",
  brand_name: "Shivansh's Mini Apps",
  tagline: "Personal software, shipped.",
  intro:
    "A living directory of mini apps built, tested, and maintained by an autonomous factory — curated by Shivansh Pratap.",
  logo_url: null,
  avatar_url: null,
  primary_cta_label: "Browse apps",
  primary_cta_href: "/apps",
  secondary_cta_label: "About the factory",
  secondary_cta_href: "/#about",
  footer_text: "© Shivansh Pratap · Mini Apps 2.0",
  social_links: [
    {
      label: "GitHub",
      href: "https://github.com/shivanshsuryavanshi",
    },
  ],
  theme: { accent: "#0F766E", ink: "#111827" },
  updated_at: now,
};

export const seedApplications: Application[] = [
  {
    id: "33333333-3333-4333-8333-333333333301",
    name: "Expense Splitter",
    slug: "expense-splitter",
    description:
      "Lite Splitwise for shared trips and flatmates — create a group, add people and expenses, see who owes whom, and settle balances. Share a link; no login required.",
    short_description:
      "Split expenses, track balances, settle up — shareable groups.",
    icon_url: null,
    cover_url: null,
    category_id: seedCategories[2].id,
    category_slug: "utilities",
    category_name: "Utilities",
    tags: ["expenses", "splitwise", "money", "groups"],
    live_url: "https://expense-splitter-murex-three.vercel.app",
    github_url: "https://github.com/acousticclown/expense-splitter",
    hosting_provider: "vercel",
    featured: true,
    visibility: "public",
    publication_status: "published",
    sort_priority: 100,
    screenshots: [],
    docs_url: null,
    created_at: now,
    updated_at: now,
    published_at: now,
  },
];

export const seedDeployments: DeploymentRecord[] = [
  {
    id: "44444444-4444-4444-8444-444444444401",
    application_id: seedApplications[0].id,
    provider: "vercel",
    environment: "production",
    status: "ready",
    url: "https://expense-splitter-murex-three.vercel.app",
    commit_sha: null,
    notes: "Expense Splitter production deploy",
    created_at: now,
    updated_at: now,
  },
];

export const seedIntegrations: IntegrationRecord[] = [
  {
    id: "55555555-5555-4555-8555-555555555501",
    provider: "github",
    status: "pending",
    project_ref: null,
    last_checked_at: now,
    notes: "Awaiting device login",
  },
  {
    id: "55555555-5555-4555-8555-555555555502",
    provider: "vercel",
    status: "pending",
    project_ref: null,
    last_checked_at: now,
    notes: "Awaiting CLI login",
  },
  {
    id: "55555555-5555-4555-8555-555555555503",
    provider: "supabase",
    status: "pending",
    project_ref: null,
    last_checked_at: now,
    notes: "Awaiting project provision",
  },
];
