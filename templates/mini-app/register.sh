#!/usr/bin/env bash
# Usage: PORTAL_URL=https://… PORTAL_REGISTER_SECRET=… ./register.sh
set -euo pipefail

: "${PORTAL_URL:?}"
: "${PORTAL_REGISTER_SECRET:?}"
: "${APP_NAME:?}"
: "${APP_SLUG:?}"
: "${LIVE_URL:?}"

curl -fsS -X POST "$PORTAL_URL/api/admin/register" \
  -H "Authorization: Bearer $PORTAL_REGISTER_SECRET" \
  -H "Content-Type: application/json" \
  -d "$(jq -n \
    --arg name "$APP_NAME" \
    --arg slug "$APP_SLUG" \
    --arg description "${APP_DESCRIPTION:-}" \
    --arg live_url "$LIVE_URL" \
    --arg github_url "${GITHUB_URL:-}" \
    --arg hosting_provider "${HOSTING_PROVIDER:-vercel}" \
    --argjson publish "${PUBLISH:-false}" \
    --arg commit_sha "${COMMIT_SHA:-}" \
    '{
      name:$name,
      slug:$slug,
      description:$description,
      live_url:$live_url,
      hosting_provider:$hosting_provider,
      publish:$publish
    }
    + (if $github_url == "" then {} else {github_url:$github_url} end)
    + (if $commit_sha == "" then {} else {commit_sha:$commit_sha} end)')"
