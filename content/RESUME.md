# Resume — Dhanai Holtzclaw

**Web:** full experience at `/resume`  
**PDF:** static export from Figma at `site/public/assets/resume/Dhanai-Holtzclaw-Resume-Art-Product.pdf`  
**Data source:** `site/lib/resume-data.ts` (keep in sync with the Figma one-pager)

---

## Download PDF

- **Static:** `/assets/resume/Dhanai-Holtzclaw-Resume-Art-Product.pdf`
- **API:** `/api/resume/pdf` (serves the same static file)

---

## Architecture

| Layer | File | Purpose |
|-------|------|---------|
| Data | `lib/resume-data.ts` | Web resume + PDF filename |
| Web UI | `components/resume/resume-web.tsx` | Full stylized resume |
| PDF layout (unused for download) | `components/resume/resume-pdf-document.tsx` | React PDF document (legacy) |
| API | `app/api/resume/pdf/route.ts` | Download endpoint |

Update `resume-data.ts`, replace the static PDF, then sync CMS (`npx tsx scripts/sync-dual-positioning.ts`) so production picks up the new copy.
