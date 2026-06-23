# Portfolio site — build spec

**Next agent:** Scaffold the marketing portfolio here. Do **not** scaffold inside Margenie.

---

## Goals

1. Marketing-quality **design engineer** portfolio (craft matters for Anthropic)
2. Fast to deploy (Vercel)
3. Easy to update case studies from `../content/`
4. Resume PDF download
5. Mobile-responsive, accessible baseline

---

## Recommended stack

```
site/
├── app/
│   ├── layout.tsx          # fonts, metadata, nav
│   ├── page.tsx            # home
│   ├── work/
│   │   ├── page.tsx        # project grid
│   │   └── [slug]/page.tsx # case studies
│   ├── about/page.tsx
│   └── resume/page.tsx       # HTML resume + PDF link
├── components/
│   ├── site-header.tsx
│   ├── project-card.tsx
│   ├── case-study-layout.tsx
│   └── motion/             # subtle framer-motion if desired
├── content/
│   └── projects/           # MDX or copy from ../content/CASE-STUDIES.md
├── public/
│   └── assets/             # symlink or copy from ../../assets/
├── package.json
└── tailwind.config.ts
```

**Init command (suggested):**
```bash
cd /Applications/MAMP/htdocs/dev/portfolio/site
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

Or manual scaffold — keep dependencies minimal.

---

## Pages

| Route | Content source |
|-------|----------------|
| `/` | Hero, 4 project tiles, short bio, contact CTA |
| `/work` | Grid: Takeout Order, Printer portal, Margenie, Parfade |
| `/work/takeout-order` | `content/CASE-STUDIES.md` §1 |
| `/work/fulfillment-portal` | §2 |
| `/work/margenie` | §3 |
| `/work/parfade` | §4 |
| `/about` | `content/POSITIONING.md` + skills matrix |
| `/resume` | Render `content/RESUME.md`; link to PDF in `assets/resume/` |

---

## Design direction

**Tone:** Editorial, confident, craft-forward — not SaaS-dashboard aesthetic.

**Typography (example pairing — pick one):**
- Display: Instrument Serif, Fraunces, or similar
- Body: Inter, Geist, or Source Sans 3
- Mono (optional): JetBrains Mono for stack tags

**Color:** Warm neutral background (#FAF9F7) or refined dark (#0A0A0A) — avoid purple AI clichés.

**Motion:** Subtle fade/slide on scroll; hover on project cards; respect `prefers-reduced-motion`.

**Layout:** Generous whitespace; large project imagery; readable measure (~65ch) for body copy.

---

## Project card data (hardcode initially)

```ts
export const projects = [
  {
    slug: "takeout-order",
    title: "Takeout Order",
    subtitle: "$3.6M hand-drawn apparel brand",
    tags: ["Brand", "Design", "Growth"],
    year: "20XX–20XX",
    image: "/assets/takeout-order/hero-design.jpg",
  },
  {
    slug: "fulfillment-portal",
    title: "Fulfillment portal",
    subtitle: "B2B print partner ops · Shopify + EasyPost",
    tags: ["AngularJS", "Firebase", "B2B"],
    year: "20XX–20XX",
    image: "/assets/printer-portal/queue.png",
  },
  {
    slug: "margenie",
    title: "Margenie",
    subtitle: "Agent-native brand ops",
    tags: ["Next.js", "Design system", "AI"],
    year: "20XX–present",
    href: "https://www.margenie.co",
    image: "/assets/margenie/style-guide.png",
  },
  {
    slug: "parfade",
    title: "Parfade",
    subtitle: "Golf rounds, side games, friends",
    tags: ["Expo", "iOS", "Social"],
    year: "20XX–present",
    image: "/assets/parfade/hero-screen.png",
  },
];
```

---

## Metadata (SEO)

```ts
export const siteConfig = {
  name: "(TBD Full Name)",
  title: "(TBD) — Design Engineer",
  description:
    "Founder-designer-engineer. Takeout Order ($3.6M), fulfillment tooling, Margenie, Parfade.",
  url: "https://(TBD)",
  links: {
    linkedin: "(TBD)",
    github: "(TBD)",
    email: "(TBD)",
  },
};
```

---

## Deploy

```bash
cd site
vercel --prod
```

Set custom domain if user has one. Add URL to:
- `content/PROJECT-FACTS.md`
- Resume header
- Greenhouse application

---

## Definition of done

- [ ] Lighthouse: Performance > 90, Accessibility > 95 (aspirational)
- [ ] All 4 case studies readable
- [ ] Resume PDF downloadable
- [ ] Contact link (email or mailto)
- [ ] Preview URL shared with user for Greenhouse Website field
- [ ] No Margenie secrets or customer data in screenshots

---

## Optional enhancements (if time)

- One **interactive** demo block (e.g. Margenie mechanic pill component isolated)
- Print stylesheet for resume page
- `og:image` per case study
- Brief “Colophon” footer listing stack
