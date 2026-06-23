# Assets guide

Gather screenshots and media into this folder before building the portfolio site.

**Do not commit:** customer PII, live API keys, unreleased designs the user hasn’t approved for public use.

---

## Folder structure

```
assets/
├── headshot/
│   └── profile.jpg              (TBD)
├── takeout-order/
│   ├── hero-design.jpg
│   ├── designs/                 (6–12 hand-drawn pieces)
│   ├── storefront/
│   └── marketing/               (ad samples)
├── printer-portal/
│   ├── queue.png
│   ├── order-detail.png
│   ├── shipping.png
│   └── diagram-architecture.svg (agent can generate)
├── margenie/
│   ├── style-guide.png
│   ├── ad-ops.png
│   ├── supercomputer-chat.png
│   └── ranked-fixes.png
├── parfade/
│   ├── hero-screen.png
│   ├── round-invite.png
│   ├── games.png
│   └── social-feed.png
└── resume/
    └── FirstName-LastName-Design-Engineer-Resume.pdf
```

---

## Capture instructions

### Takeout Order
- User provides design exports or photography
- Screenshot Shopify/storefront from live or staging
- Optional: revenue chart (anonymized)

### Printer portal (`takeout-orders`)
- Run locally or staging if still available
- Capture: login/dashboard, order list, single order, label/shipping step
- Blur any customer addresses

### Margenie
- Use demo store or staging — **no real merchant data**
- Pages: `/style-guide`, `/ads`, Supercomputer chat with sample prompts
- Full-page screenshots at 1440px width

### Parfade
- iOS Simulator screenshots from `partee/apps/mobile`
- Or App Store marketing frames if available
- Recommended device: iPhone 15 Pro frame

---

## Image specs

| Use | Size | Format |
|-----|------|--------|
| Hero | 2400×1350 or 16:9 | WebP + JPG fallback |
| Case study inline | 1600px wide max | WebP |
| Thumbnails | 800×600 | WebP |
| OG / social | 1200×630 | PNG |

Optimize with `sharp` or Squoosh before deploy.

---

## Diagrams to create (agent)

1. **Printer portal flow** — Shopify → Portal → EasyPost (SVG)
2. **Margenie agent flow** — User → Tools → Approval card → API (SVG)
3. **Parfade core loop** — 4-step horizontal (SVG)

Store in respective project folders under `assets/`.

---

## Legal / privacy

- Confirm user owns rights to Takeout Order creative
- Margenie: OK for public portfolio per `PROJECT-FACTS.md`
- Parfade: App Store assets may have Apple guidelines if using official badges
