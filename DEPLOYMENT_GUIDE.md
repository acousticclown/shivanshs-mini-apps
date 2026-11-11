# Deployment guide

1. Apply `supabase/migrations/*.sql` to the Supabase project.
2. Set env vars from `.env.example` in the host secret store.
3. Insert your user into `admin_users` (or rely on bootstrap email upsert on first login).
4. Deploy to Vercel (`vercel --prod`) or approved host.
5. Verify `/`, `/apps`, `/admin`, `/api/health`.
6. Save production URL in `INFRASTRUCTURE.md` (no secrets).

Factory apps register via `/api/admin/register` after a verified production URL.
