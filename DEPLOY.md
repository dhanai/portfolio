# Deploy to Vercel

Repo: [github.com/dhanai/portfolio](https://github.com/dhanai/portfolio)

## Troubleshooting `404: NOT_FOUND`

**Cause:** Vercel is building the repo root instead of `site/`, or the build failed (no deployment).

**Fix:**
1. Project → Settings → General → **Root Directory** → `site` → Save (required — cannot be set in `vercel.json`)
2. Settings → Environment Variables — add `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_PASSWORD`
3. Deployments → Redeploy latest (or push to `main`)

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
1. Add **Neon** + **Blob** in Vercel → Storage (you did this)
2. Vercel injects `DATABASE_URL` (Neon) and `BLOB_READ_WRITE_TOKEN` (Blob) automatically
3. Prisma uses **PostgreSQL** — from your machine once:

```bash
cd site
# Paste Neon pooled connection string into .env as DATABASE_URL
npx prisma db push
npm run db:seed
```

4. Redeploy on Vercel

Work preview uploads go to **Vercel Blob** in production; local dev still writes to `public/assets/work/` unless you set `BLOB_READ_WRITE_TOKEN` locally.

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
