# Infrastructure

| Resource | Provider | Tier | Notes |
|----------|----------|------|-------|
| Source | GitHub | Free | https://github.com/acousticclown/shivanshs-mini-apps |
| Portal app | Vercel (preferred) | Hobby/free | Pending CLI login + deploy |
| Database + Auth | Supabase | Free | Migration ready in `supabase/migrations/` |
| Fallback publish | Cursor publish-app | — | Requires run linked to this repo |

Never store secrets in git. Use Vercel/Supabase/Cursor secret stores.

IDs (no secrets):

- GitHub repo: `acousticclown/shivanshs-mini-apps`
- Supabase project ref: _(pending)_
- Vercel project: _(pending)_
- Local verify: `http://127.0.0.1:3000` (demo mode)
