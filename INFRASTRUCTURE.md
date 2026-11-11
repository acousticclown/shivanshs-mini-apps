# Infrastructure

| Resource | Provider | Tier | Notes |
|----------|----------|------|-------|
| Source | GitHub | Free | https://github.com/acousticclown/shivanshs-mini-apps |
| Portal app | Vercel Hobby | Free | https://shivanshs-mini-apps.vercel.app |
| Database + Auth | Supabase Free | Free | Project ref `yconkkmnfyykhwflumed` (ap-south-1) |
| Migrations | Applied | — | `supabase/migrations/20261111120000_portal_schema.sql` |

Secrets live only in Vercel / Supabase platform stores — never in git.
