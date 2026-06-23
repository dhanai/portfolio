# Agent handoff: Portfolio & Anthropic application

**Created:** 2026-06-07  
**Owner:** Dhanai  
**Workspace:** `/Applications/MAMP/htdocs/dev/portfolio`  
**Do not work in:** `../sumrise/sumrise-next` (Margenie) unless explicitly pulling screenshots or copy — keep all portfolio artifacts here.

---

## Mission

Help Dhanai **apply for Anthropic’s Design Engineer, Web role** by delivering:

1. A **polished portfolio website** (design + code, deployable)
2. A **resume** (PDF + optional LinkedIn-aligned Markdown)
3. **Application-ready copy** (Why Anthropic, case studies, talking points)
4. An **asset pack** (screenshots, diagrams, optional PDF export)

The user is a **founder-designer-engineer**, not a generic React applicant. Lead with craft, revenue, and production systems — not “I used Cursor.”

---

## Target job

**Title:** Design Engineer, Web  
**URL:** https://job-boards.greenhouse.io/anthropic/jobs/5223916008  
**Team:** Anthropic Creative Studio → Brand Web (anthropic.com, claude.com)  
**Salary:** $305,000 – $385,000 USD  

**They want:**
- Next.js / React at scale, architecture ownership
- Headless CMS, content modeling, editorial governance
- Internal/creative tooling (Claude-powered, MCP-style)
- Craft: typography, motion, interaction
- Cross-team partnership (platform, security, growth)
- Localization, performance, accessibility

**User’s fit (strong):**
- Founded **Takeout Order** — hand-drew designs, ran marketing, **$3.6M sales / 6 years**
- Built **B2B printer fulfillment portal** (AngularJS + Firebase + Shopify + EasyPost) — real operators depended on it
- Building **Margenie** (Next.js) — agent playbooks, Ops design system, Meta diagnostics, human-in-the-loop approvals
- Built **Parfade** — Expo/RN iOS app for golf rounds, side games, light social (`../partee`)

**Gaps to address in portfolio (don’t hide):**
- Enterprise headless CMS (Contentful/Sanity) — study + one thoughtful paragraph
- Marketing-site Core Web Vitals at huge scale
- Formal eng leadership / hiring — frame as founder technical owner

---

## Repo map (read-only references)

```
/Applications/MAMP/htdocs/dev/
├── portfolio/                 ← YOU ARE HERE (create everything)
├── sumrise/sumrise-next/    ← Margenie (Next.js, production)
├── takeout-orders/          ← Printer portal (AngularJS, Firebase, takeoutorder.co)
├── takeout-next/            ← Takeout storefront (Next.js — confirm with user)
├── partee/                  ← Parfade (Next.js + Expo mobile)
└── takeoutorder/            ← Possibly legacy WP/shop assets — verify
```

### Margenie highlights to screenshot (read-only)

- Ops design system / style guide: `/dashboard/[storeSlug]/style-guide`
- Ad Ops review + mechanic pills: `/dashboard/[storeSlug]/ads`
- Supercomputer chat: ranked fixes, work checklist, agent cards
- Live: https://www.margenie.co

### Printer portal (`takeout-orders`)

- Entry: `public/index.html` — AngularJS app `ng-app="takeout-orders"`
- Firebase: `firebase.json`, `functions/` (Shopify + EasyPost deps)
- Domain referenced: takeoutorder.co (fulfillment, not consumer storefront)

### Parfade (`partee`)

- Monorepo: Next.js backend at root, mobile at `apps/mobile/`
- Package name: `parfade`
- Features: rounds, invites, side games, groups, chat (Ably), push notifications

---

## Deliverables checklist

### Phase 1 — Content (mostly drafted in `content/`)

- [ ] User fills gaps in `content/PROJECT-FACTS.md` (dates, metrics, contact)
- [ ] Finalize `content/RESUME.md` → export PDF
- [ ] Finalize `content/WHY-ANTHROPIC.md` (200–400 words, user voice pass)
- [ ] Expand `content/CASE-STUDIES.md` into final copy per project

### Phase 2 — Assets (`assets/`)

- [ ] Takeout Order: 6–12 designs, storefront, campaign sample
- [ ] Printer portal: queue, order detail, shipping flow screenshots
- [ ] Margenie: style guide, Ad Ops, chat cards (sanitized — no customer data)
- [ ] Parfade: 4–6 mobile screens, core loop diagram
- [ ] Headshot + logo/wordmark if available

See `assets/README.md` for filenames and structure.

### Phase 3 — Portfolio site (`site/`)

Build a **marketing-quality** personal site — not a dashboard clone.

**Recommended stack:**
- Next.js (App Router) + TypeScript
- Tailwind or CSS modules — **refined typography** (this is a design engineer application)
- MDX or content in `content/` for case studies
- Deploy: Vercel (personal project)

**Required pages:**
1. **Home** — hero, one-liner, 4 project tiles, contact
2. **Work index** — grid of case studies
3. **Case study ×4** — Takeout Order, Printer portal, Margenie, Parfade
4. **About** — founder story, skills matrix
5. **Resume** — HTML version + PDF download

**Design direction:**
- Hand-made / editorial feel (nod to Takeout Order craft)
- Restrained motion (scroll, hover — not gimmicky)
- Excellent type scale and spacing — Anthropic cares about craft
- Dark or warm neutral palette; avoid generic “AI startup purple gradient”

**Spec:** `site/README.md`

### Phase 4 — Application

- [ ] Greenhouse form: https://job-boards.greenhouse.io/anthropic/jobs/5223916008
- [ ] Resume/CV upload
- [ ] LinkedIn URL (align with resume)
- [ ] **Why Anthropic** — paste from `content/WHY-ANTHROPIC.md`
- [ ] Read & confirm **Anthropic AI partnership policy for candidates** (required field)
- [ ] Office hybrid 25% — user answers honestly
- [ ] Visa / relocation / start date / work address

See `APPLICATION.md`.

---

## Narrative arc (use everywhere)

**One-liner:**  
Founder-designer-engineer: scaled a hand-drawn apparel brand to $3.6M, built B2B fulfillment tooling and a consumer golf app, and now ships agent-native brand ops in Next.js.

**Four acts:**
1. **Takeout Order** — craft + growth + merchant reality
2. **Printer portal** — B2B ops, integrations, legacy production stack
3. **Margenie** — AI-native workflows, design system, steerable automation
4. **Parfade** — consumer UX, social loops, mobile shipping

**How to frame Cursor/AI:**  
User uses AI to accelerate implementation; **they** own architecture, review, and production decisions. Anthropic requires acknowledging their candidate AI policy — never present work as fully AI-generated.

**Printer app (AngularJS + Firebase):**  
Own it confidently: “Ran in production for years; taught me ops software requirements; new work is Next.js/TypeScript.”

---

## What to ask the user first

1. Legal name, email, phone, location, LinkedIn, personal site URL (if any)
2. Takeout Order dates, still active?, exact revenue confirmation ($3.6M gross?)
3. Printer portal: years in production, # printers, orders/month (rough)
4. Parfade: App Store link?, stack confirm (Expo), any usage metrics
5. Margenie: OK to show publicly? Sanitized demo store slug?
6. Office: open to SF/NYC 25% hybrid?
7. Visa sponsorship needed?
8. Tone preference for site (minimal editorial vs bold/playful)

---

## Out of scope (unless user asks)

- Changes to Margenie codebase
- Applying on user’s behalf without review
- Fabricating metrics or employers

---

## Suggested agent session plan

1. Read this file + `content/PROJECT-FACTS.md`
2. Ask user for missing facts (batch questions)
3. Scaffold `site/` Next.js portfolio per `site/README.md`
4. Pull/copy screenshots into `assets/` (user may need to provide Takeout/Parfade visuals)
5. Write case study pages from `content/CASE-STUDIES.md`
6. Generate resume PDF (e.g. `content/RESUME.md` → print or use a simple PDF tool)
7. User review pass on Why Anthropic + resume
8. Deploy preview URL for portfolio; user submits Greenhouse

---

## Files in this repo

```
portfolio/
├── HANDOFF.md              ← this file
├── README.md
├── APPLICATION.md
├── content/
│   ├── RESUME.md
│   ├── WHY-ANTHROPIC.md
│   ├── CASE-STUDIES.md
│   ├── PROJECT-FACTS.md
│   └── POSITIONING.md
├── assets/
│   └── README.md
└── site/
    └── README.md           ← next agent scaffolds Next.js here
```

Good luck — this is a genuinely strong profile for Creative Studio if the craft shows in the portfolio.
