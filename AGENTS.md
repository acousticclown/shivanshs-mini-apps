# Agent instructions — Shivansh's Mini Apps

## Operating principles

- Portal DB is source of truth for what the public sees.
- Execute setup; do not stop at “how to” docs when credentials allow.
- Never store secrets in docs or commits.
- Ask before paid resources, destructive prod ops, or irreversible account changes.
- Prefer CLI/API over browser automation.

## Codebase map

- `src/app` — public + admin routes, API
- `src/lib/portal.ts` — registry access (Supabase or demo)
- `src/types/registry.ts` — zod schemas
- `supabase/migrations` — SQL + RLS
- `templates/mini-app` — factory skeleton

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
