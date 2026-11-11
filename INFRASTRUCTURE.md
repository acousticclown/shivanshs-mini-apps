# Infrastructure

| Resource | Provider | Tier | Notes |
|----------|----------|------|-------|
| Portal app | Vercel (preferred) | Hobby/free | Next.js |
| Database + Auth | Supabase | Free | Migrations in `supabase/migrations/` |
| Source | GitHub | Free | This repository |
| Fallback publish | Cursor publish-app | — | When Vercel auth pending |

Never store secrets in git. Use Vercel/Supabase/Cursor secret stores.

IDs (fill after provision; never secrets):

- GitHub repo: _(pending auth)_
- Supabase project ref: _(pending)_
- Vercel project: _(pending)_
