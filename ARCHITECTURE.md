# Architecture

## Surfaces

- `/` — brand hero, featured apps, about
- `/apps` — searchable directory with categories
- `/apps/[slug]` — detail + launch links (apps open independently)
- `/admin` — protected dashboard (stats, CRUD, settings, deployments)
- `/api/admin/register` — factory auto-registration (Bearer secret)

## Data

Tables: `admin_users`, `site_settings`, `applications`, `application_categories`, `application_tags`, `application_tag_relations`, `deployment_records`, `integration_records`, `audit_logs`.

RLS: public read of published/public apps + settings; admin write only.

## Modes

- **Supabase mode** when `NEXT_PUBLIC_SUPABASE_URL` + anon/publishable key are set.
- **Demo mode** otherwise — in-memory seed store for local/preview; same UI/API shapes.

## Auth

- Supabase Auth (magic link / password) + `admin_users` gate.
- Demo cookie login restricted to `ADMIN_BOOTSTRAP_EMAILS`.
