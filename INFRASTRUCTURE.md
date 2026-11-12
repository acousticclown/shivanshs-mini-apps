# Infrastructure

| Resource | Provider | Tier | Notes |
|----------|----------|------|-------|
| Source | GitHub | Free | https://github.com/acousticclown/shivanshs-mini-apps |
| Portal app | Vercel Hobby | Free | https://shivanshs-mini-apps.vercel.app |
| Database + Auth | Supabase Free | Free | Project ref `yconkkmnfyykhwflumed` (ap-south-1) |
| Migrations | Applied | — | Portal schema + `20261111160000_expense_splitter.sql` (shared DB) |
| Expense Splitter | Vercel Hobby | Free | https://expense-splitter-murex-three.vercel.app · repo `acousticclown/expense-splitter` |

Secrets live only in Vercel / Supabase platform stores — never in git.
