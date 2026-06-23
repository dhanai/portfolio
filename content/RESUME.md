# Resume — Dhanai Holtzclaw

**Web:** full experience at `/resume` (stylized, scrollable)  
**PDF:** one-page export via `@react-pdf/renderer`  
**Data source:** `site/lib/resume-data.ts`

---

## Download PDF

- **Live:** `/api/resume/pdf` (generated on demand)
- **Static:** `/assets/resume/Dhanai-Holtzclaw-Design-Engineer-Resume.pdf`
- **Regenerate:** `cd site && npm run resume:pdf` (also runs after `npm run build`)

---

## Architecture

| Layer | File | Purpose |
|-------|------|---------|
| Data (full) | `lib/resume-data.ts` | Web resume + shared contact |
| Data (PDF) | `resumePdfContent` in same file | Condensed one-pager copy |
| Web UI | `components/resume/resume-web.tsx` | Full stylized resume |
| PDF layout | `components/resume/resume-pdf-document.tsx` | React PDF document |
| Generator | `lib/generate-resume-pdf.tsx` | `renderToBuffer()` wrapper |
| API | `app/api/resume/pdf/route.ts` | Download endpoint |

Web and PDF share `resumeData`. PDF uses a two-column layout (experience left, earlier career + skills right) styled to mirror the web resume — accent bar, dash bullets, bordered skill cells.

To tune density, edit `components/resume/resume-pdf-document.tsx`.
