# Deploy to Vercel

Repo: [github.com/dhanai/portfolio](https://github.com/dhanai/portfolio)

## Troubleshooting `404: NOT_FOUND`

**Cause:** Vercel is building the repo root instead of `site/`, or the build failed (no deployment).

**Fix:**
1. Project → Settings → General → **Root Directory** → `site` → Save
2. Or rely on root `vercel.json` (`"rootDirectory": "site"`) after pulling latest
3. Settings → Environment Variables — add `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_PASSWORD`
4. Deployments → Redeploy latest (or push to `main`)

Do **not** set a custom Output Directory — Next.js on Vercel handles this automatically.

1. [vercel.com/new](https://vercel.com/new) → Import **dhanai/portfolio**
2. **Root Directory:** `site` (required — Next.js app lives here)
3. Framework: Next.js (auto-detected)

## 2. Environment variables

Add these in Vercel → Project → Settings → Environment Variables:

| Variable | Production | Notes |
|----------|------------|--------|
| `DATABASE_URL` | See below | Required for build + runtime |
| `SESSION_SECRET` | Random 32+ chars | Admin session encryption |
| `ADMIN_PASSWORD` | Strong password | `/admin/login` |

### Database options

**Option A — Public site only (simplest)**  
Set `DATABASE_URL` to `file:./dev.db` for the build. The site falls back to static content when the DB is empty. Admin CMS **will not persist** on serverless (SQLite is ephemeral).

**Option B — Full CMS on Vercel (recommended)**  
1. Add [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or [Neon](https://neon.tech) (free tier)
2. Change `site/prisma/schema.prisma` provider from `sqlite` to `postgresql`
3. Set `DATABASE_URL` to the Postgres connection string
4. From your machine: `cd site && npx prisma db push && npm run db:seed` (with prod `DATABASE_URL` in env)

## 3. Deploy

Push to `main` — Vercel deploys automatically.

```bash
git push origin main
```

## 4. After deploy

- Set custom domain (e.g. `dhanai.dev`) in Vercel → Domains
- Run `npm run db:seed` against production DB if using Postgres
- Upload work preview images via `/admin` (or commit files under `site/public/assets/work/`)

## Local vs production

| | Local (MAMP) | Vercel |
|--|--------------|--------|
| Dev | `cd site && npm run dev` | — |
| DB | SQLite `prisma/dev.db` | Postgres (Option B) or static fallbacks (Option A) |
| Admin | http://localhost:3000/admin | `https://your-domain/admin` |
