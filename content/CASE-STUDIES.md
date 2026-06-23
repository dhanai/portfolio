# Case study outlines

Expand each section into portfolio page copy. Target **800–1200 words** per case study or a tight **scroll narrative** (hero → problem → process → outcome → reflection).

---

## 1. Takeout Order

**Tags:** Brand · Hand-drawn design · DTC · $3.6M  
**Hero image:** Best-selling design or collage of catalog  
**Role:** Founder, designer, marketer, operator

### Sections

**Hook**  
Hand-drawn apparel brand I founded and scaled to $3.6M over six years — every design mine, every campaign mine.

**Problem**  
Differentiate in a crowded DTC market without a agency or corporate team; keep creative fresh as ad performance evolved.

**Process**
- Hand-drew full catalog; owned visual identity
- Ran performance marketing (Meta, etc. — confirm channels)
- Iterated on winners, managed catalog lifecycle
- Built ops tooling when scale broke manual workflows (link to case study 2)

**Outcome**
- $3.6M sales / 6 years
- (TBD: orders, AOV, channels)

**Reflection / Anthropic angle**  
Brand is performance under pressure — creative fatigue, trust, conversion. Informed how I think about Margenie’s Ad Ops and refresh recommendations.

**Assets needed**
- Design process shots (sketch → final)
- Storefront screenshots
- Ad creative samples (1–2)

---

## 2. Printer fulfillment portal

**Tags:** B2B · AngularJS · Firebase · Shopify · EasyPost  
**Hero image:** Order queue or shipping flow screenshot  
**Role:** Sole builder

### Sections

**Hook**  
When Takeout Order outgrew email chains, I built the tool my print partners actually used every day.

**Problem**  
Third-party printers needed one place to receive jobs, print, pack, and ship — without spreadsheet chaos.

**Architecture (diagram recommended)**
```
Shopify orders → Firebase/Functions → Printer portal (AngularJS)
                                      ↓
                              EasyPost labels → Ship
```

**Process**
- Order state machine: received → in production → shipped / exception
- UX for non-engineers
- Shopify + EasyPost integration details (user to validate)

**Stack honesty**  
AngularJS + Firebase — production for (TBD) years. Maintained while building modern Next.js products.

**Outcome**
- (TBD: printers, order volume, time saved)

**Reflection / Anthropic angle**  
Internal tools that non-engineers depend on; structured data; partner workflows — same shape as CMS ops and creative tooling.

**Assets needed**
- 3–4 app screenshots
- Architecture diagram (agent can generate SVG)

---

## 3. Margenie

**Tags:** Next.js · Agents · Design system · Meta · Shopify  
**Hero image:** Supercomputer chat or Ops style guide  
**Role:** Founder, design engineer  
**URL:** https://www.margenie.co

### Sections

**Hook**  
The ops brain I wished I had running Takeout Order — agent-native, approval-first, design-system driven.

**Problem**  
Shopify brands juggle profit, Meta ads, creative refresh, and shipping in scattered tools; AI assistants suggest changes but don’t integrate with real workflows.

**Solution pillars**
1. **Ops design system** — OpsCard, checklists, todo lists, mechanic pills
2. **Supercomputer** — playbooks, ranked fixes, streaming tools
3. **Ad Ops** — pause/scale/refresh with Meta mechanics (learning, overlap, breakdown)
4. **Integrations** — Shopify, Meta sync, EasyPost, creative studio

**Process highlights**
- Human-in-the-loop: propose → approve → execute
- `declare_work_plan` / checklist UX for visible agent progress
- Recent: Meta diagnostics module (`lib/ads/meta-mechanics/`)

**Stack**  
Next.js, TypeScript, Prisma, Vercel

**Outcome**  
Production SaaS; (TBD: users, stores)

**Reflection / Anthropic angle**  
Closest analog to “Claude-powered workflows + design system code + MCP-style tools.” Emphasize **user** made architecture and craft decisions.

**Assets needed**
- Style guide page screenshot
- Ad Ops with mechanic tags
- Ranked fixes / checklist in chat (sanitized)
- Optional: architecture diagram

**Code reference (read-only):** `../sumrise/sumrise-next`

---

## 4. Parfade

**Tags:** iOS · Expo · Golf · Social · Side games  
**Hero image:** Mobile hero screen (round invite or game session)  
**Role:** Founder, product, mobile  
**Code:** `../partee/apps/mobile`

### Sections

**Hook**  
Golf is social; coordination and side games shouldn’t live in group texts.

**Problem**  
Scheduling rounds, inviting friends, and running games (dots, skins, etc.) across fragmented tools.

**Core loop**
```
Plan round → Invite friends → Play round + side games → Results + social feed
```

**Features**
- Round scheduling & invites
- Side games / game sessions
- Groups, chat (Ably), push notifications
- Profile & activity feed

**Stack**  
Expo / React Native; Next.js API at `../partee`

**Outcome**  
(TBD: App Store link, metrics)

**Reflection / Anthropic angle**  
Consumer interaction design; modular features; rapid prototype → ship — relevant to interactive marketing surfaces.

**Assets needed**
- 4–6 iPhone frames (Figma or device mockups)
- Core loop diagram

---

## Case study page template (for site)

```mdx
---
title: Project Name
subtitle: One-line outcome
tags: [Next.js, ...]
year: 20XX
role: Founder · Design Engineer
---

<Hero image="" />

## Overview
...

## Problem
...

## Approach
...

## Outcome
...

## What I'd do differently
...

<NextProject />
```
