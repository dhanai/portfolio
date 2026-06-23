import { siteConfig } from "./site-config";

export type ResumeJob = {
  company: string;
  role: string;
  period: string;
  bullets: string[];
};

export type EarlierJob = {
  company: string;
  role: string;
  period: string;
};

export const resumeData = {
  name: siteConfig.fullName,
  headline: "Design Engineer · Founder",
  subheadline:
    "Next.js · React · TypeScript · design systems · agent tooling · Shopify · Meta · iOS",
  contact: {
    location: "Los Angeles, CA",
    email: siteConfig.links.email,
    phone: siteConfig.links.phone,
    linkedin: "linkedin.com/in/dhanai",
    portfolio: siteConfig.url.replace("https://", ""),
  },
  summary:
    "Los Angeles–based design engineer and founder with 20+ years in design, UI/UX, and front-end development. Hand-built a $3.8M apparel brand, production B2B fulfillment software, and a consumer golf app — now building agent-native brand operations in Next.js.",
  experience: [
    {
      company: "Margenie",
      role: "Founder · Design Engineer",
      period: "2026 – Present",
      bullets: [
        "Building agent-native ops platform for Shopify brands: profit metrics, Meta ad diagnostics, in-chat creative workflows",
        "Designed Ops design system (shared components, style guide) across Ad Ops and Supercomputer chat",
        "Built Supercomputer agent layer: playbooks, ranked fixes, streaming tools, human-in-the-loop approvals",
        "Generative creative for ad refresh via fal.ai (Nano Banana 2, Seedance 2) — approval-first, not auto-publish",
        "Stack: Next.js, React, TypeScript, Prisma, Meta Graph API, Shopify API, Vercel",
      ],
    },
    {
      company: "Takeout Order",
      role: "Founder · Designer · Operator",
      period: "2020 – Present",
      bullets: [
        "$3,788,518.88 gross sales since Jan 2020 — hand-drew full catalog, owned marketing and DTC operations",
        "Directed brand identity across web, paid social, and email; iterative performance creative testing",
        "Built internal fulfillment software when scale broke manual workflows",
      ],
    },
    {
      company: "Fulfillment portal",
      role: "Product · Engineering",
      period: "2020 – Present",
      bullets: [
        "B2B web portal for print partners — Shopify ingest, EasyPost labels, order state machine",
        "Production on AngularJS + Firebase; maintained while shipping greenfield Next.js products",
      ],
    },
    {
      company: "Parfade",
      role: "Founder · Product · iOS",
      period: "2026 – Present",
      bullets: [
        "iOS app for golfers — round scheduling, side games, real-time chat, push notifications",
        "Stack: Expo, React Native, Next.js API, Drizzle, Neon Postgres, Ably",
      ],
    },
  ] satisfies ResumeJob[],
  earlierCareer: [
    { company: "DJcity", role: "Creative Director", period: "2013 – 2019" },
    { company: "Ciplex", role: "Creative Director", period: "2010 – 2013" },
    { company: "Mego", role: "Creative Director", period: "2009 – 2010" },
    { company: "Getback", role: "Art Director", period: "2008 – 2009" },
    { company: "Hello Design", role: "Lead Designer", period: "2007 – 2008" },
    { company: "Cytek Studios", role: "Lead Designer", period: "2005 – 2007" },
    { company: "Resultz", role: "Interactive Designer", period: "2003 – 2005" },
  ] satisfies EarlierJob[],
  skills: {
    Frontend:
      "Next.js, React, TypeScript, design systems, CSS/Tailwind, accessibility",
    Mobile: "Expo, React Native",
    "Backend / data": "Node.js, Prisma, Firebase, REST/API design",
    Integrations: "Shopify, Meta Marketing API, EasyPost",
    Design: "Brand identity, UI/UX, hand illustration, motion, prototyping",
    Tools: "Figma, Vercel, Cursor (AI-assisted, human-directed architecture)",
  },
};

export const RESUME_PDF_FILENAME = "Dhanai-Holtzclaw-Design-Engineer-Resume.pdf";
