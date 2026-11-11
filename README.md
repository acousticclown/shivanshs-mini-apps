# Shivansh's Mini Apps

Public portal + private admin for **Shivansh's Mini Apps** — the directory and control plane for an autonomous mini-app factory.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres, Auth, RLS) — portal DB is source of truth
- Vercel hosting (default)
- Demo mode when Supabase env is unset (in-memory seed registry)

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

- Public: http://localhost:3000
- Admin: http://localhost:3000/admin (demo login with bootstrap email)

## Scripts

- `npm run dev` — local development
- `npm run build` / `npm start` — production build
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`

## Docs

See `PROJECT_VISION.md`, `ARCHITECTURE.md`, `INFRASTRUCTURE.md`, `DEPLOYMENT_GUIDE.md`, and `AGENTS.md`.
