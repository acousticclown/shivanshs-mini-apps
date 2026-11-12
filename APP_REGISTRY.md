# App registry

Canonical metadata lives in the portal database (`applications` + related tables).

Published apps (production):

| Slug | Status | Featured | Live URL |
|------|--------|----------|----------|
| expense-splitter | published | yes | https://expense-splitter-murex-three.vercel.app |

Dummy/sample apps (Focus Timer, Palette Lab, JSON Diff Desk, Signal Sketch) were removed from the registry.

Factory registration: `templates/mini-app/register.sh` → `/api/admin/register`.
