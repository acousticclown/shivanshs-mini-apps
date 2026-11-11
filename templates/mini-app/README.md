# Mini App Template

Reusable skeleton for factory-built apps that register into **Shivansh's Mini Apps**.

## Contract

1. Ship a production URL.
2. `POST` metadata to the portal register endpoint with `Authorization: Bearer $PORTAL_REGISTER_SECRET`.
3. Portal DB remains the source of truth for public visibility.

## Register payload

```json
{
  "name": "My Mini App",
  "slug": "my-mini-app",
  "description": "One-liner and details",
  "live_url": "https://my-app.example.com",
  "github_url": "https://github.com/you/my-mini-app",
  "hosting_provider": "vercel",
  "publish": false,
  "commit_sha": "abc123"
}
```

`publish: false` creates/updates a **draft**. Admins promote to published in the portal.

## Suggested layout

```
app/          # Next.js App Router (or framework of choice)
public/
README.md
AGENTS.md
```

Keep secrets out of git. Prefer free-tier hosting unless approved otherwise.
