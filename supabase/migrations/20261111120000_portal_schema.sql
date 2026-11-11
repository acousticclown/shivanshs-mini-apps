-- Mini Apps Portal schema + RLS
-- Portal DB is the source of truth for what the public sees.

create extension if not exists "pgcrypto";

-- admin_users: maps auth.users to portal admins
create table if not exists public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text not null default '',
  role text not null default 'admin' check (role in ('owner', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null default 'Shivansh''s Mini Apps',
  tagline text not null default 'Personal software, shipped.',
  intro text not null default '',
  logo_url text,
  avatar_url text,
  primary_cta_label text not null default 'Browse apps',
  primary_cta_href text not null default '/apps',
  secondary_cta_label text not null default 'About',
  secondary_cta_href text not null default '/#about',
  footer_text text not null default '',
  social_links jsonb not null default '[]'::jsonb,
  theme jsonb not null default '{"accent":"#0F766E","ink":"#111827"}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.application_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  sort_priority int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.application_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  short_description text not null default '',
  icon_url text,
  cover_url text,
  category_id uuid references public.application_categories (id) on delete set null,
  live_url text,
  github_url text,
  hosting_provider text not null default 'vercel'
    check (hosting_provider in ('vercel','railway','render','cloudflare','cursor','other')),
  featured boolean not null default false,
  visibility text not null default 'public'
    check (visibility in ('public','unlisted','private')),
  publication_status text not null default 'draft'
    check (publication_status in ('draft','published','archived','hidden')),
  sort_priority int not null default 0,
  screenshots jsonb not null default '[]'::jsonb,
  docs_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.application_tag_relations (
  application_id uuid not null references public.applications (id) on delete cascade,
  tag_id uuid not null references public.application_tags (id) on delete cascade,
  primary key (application_id, tag_id)
);

create table if not exists public.deployment_records (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications (id) on delete set null,
  provider text not null,
  environment text not null default 'production'
    check (environment in ('preview','production')),
  status text not null default 'pending'
    check (status in ('pending','building','ready','error','cancelled')),
  url text,
  commit_sha text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.integration_records (
  id uuid primary key default gen_random_uuid(),
  provider text not null unique,
  status text not null default 'pending'
    check (status in ('connected','pending','error','disconnected')),
  project_ref text,
  last_checked_at timestamptz,
  notes text not null default ''
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.admin_users (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists applications_status_idx
  on public.applications (publication_status, visibility, featured, sort_priority desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users au where au.id = auth.uid()
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists applications_updated_at on public.applications;
create trigger applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.application_categories enable row level security;
alter table public.application_tags enable row level security;
alter table public.applications enable row level security;
alter table public.application_tag_relations enable row level security;
alter table public.deployment_records enable row level security;
alter table public.integration_records enable row level security;
alter table public.audit_logs enable row level security;

-- Public read: published + public apps, public settings, categories/tags
create policy "public read published apps"
  on public.applications for select
  using (
    publication_status = 'published' and visibility = 'public'
    or public.is_admin()
  );

create policy "admin write apps"
  on public.applications for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "public read settings"
  on public.site_settings for select
  using (true);

create policy "admin write settings"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "public read categories"
  on public.application_categories for select
  using (true);

create policy "admin write categories"
  on public.application_categories for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "public read tags"
  on public.application_tags for select
  using (true);

create policy "admin write tags"
  on public.application_tags for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "public read tag relations"
  on public.application_tag_relations for select
  using (true);

create policy "admin write tag relations"
  on public.application_tag_relations for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin read deployments"
  on public.deployment_records for select
  using (public.is_admin());

create policy "admin write deployments"
  on public.deployment_records for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin read integrations"
  on public.integration_records for select
  using (public.is_admin());

create policy "admin write integrations"
  on public.integration_records for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin read audit"
  on public.audit_logs for select
  using (public.is_admin());

create policy "admin write audit"
  on public.audit_logs for insert
  with check (public.is_admin());

create policy "admin read admin_users"
  on public.admin_users for select
  using (public.is_admin() or id = auth.uid());

create policy "owner write admin_users"
  on public.admin_users for all
  using (
    exists (
      select 1 from public.admin_users au
      where au.id = auth.uid() and au.role = 'owner'
    )
  )
  with check (
    exists (
      select 1 from public.admin_users au
      where au.id = auth.uid() and au.role = 'owner'
    )
  );

-- Seed defaults (safe to re-run with ON CONFLICT)
insert into public.site_settings (id, brand_name, tagline, intro, footer_text)
values (
  '22222222-2222-4222-8222-222222222201',
  'Shivansh''s Mini Apps',
  'Personal software, shipped.',
  'A living directory of mini apps built, tested, and maintained by an autonomous factory — curated by Shivansh Pratap.',
  '© Shivansh Pratap · Mini Apps 2.0'
)
on conflict (id) do nothing;

insert into public.application_categories (id, name, slug, description, sort_priority) values
  ('11111111-1111-4111-8111-111111111101', 'Productivity', 'productivity', 'Tools that sharpen focus and flow.', 10),
  ('11111111-1111-4111-8111-111111111102', 'Creative', 'creative', 'Sketch, remix, and make.', 20),
  ('11111111-1111-4111-8111-111111111103', 'Utilities', 'utilities', 'Small sharp tools for everyday tasks.', 30),
  ('11111111-1111-4111-8111-111111111104', 'Experiments', 'experiments', 'Prototypes and playful R&D.', 40)
on conflict (slug) do nothing;

insert into public.integration_records (provider, status, notes) values
  ('github', 'pending', 'Awaiting device login'),
  ('vercel', 'pending', 'Awaiting CLI login'),
  ('supabase', 'pending', 'Awaiting project provision')
on conflict (provider) do nothing;
