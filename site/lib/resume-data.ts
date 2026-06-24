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
  headline: "Designer · Developer · Director",
  subheadline:
    "Art direction · Next.js · AI video · generative creative · brand to code",
  contact: {
    location: "Los Angeles, CA",
    email: siteConfig.links.email,
    phone: siteConfig.links.phone,
    linkedin: "linkedin.com/in/dhanai",
    github: "github.com/dhanai",
    portfolio: siteConfig.url.replace("https://", ""),
  },
  summary:
    "Twenty years designing, directing, and building. I hand-drew a brand to $3.8M in lifetime sales and built the software that runs it, ship production apps in Next.js, and keep a daily practice in AI video and creative direction. Most people pick a lane — I take the whole arc, from concept to craft to code to shipped.",
  experience: [
    {
      company: "Takeout Order",
      role: "Founder",
      period: "2020 – Present",
      bullets: [
        "Founded and scaled a hand-drawn apparel brand to $3.8M in lifetime sales — designed the identity, drew the full catalog, and ran marketing and DTC",
        "Built the internal software that runs fulfillment: Shopify ingest, EasyPost labels, and an order state machine operators run unattended",
        "Direct AI-native ad creative — generative video and image alongside live-action shoots (Seedance, Kling, Nano Banana via fal.ai)",
      ],
    },
    {
      company: "Margenie",
      role: "Founder",
      period: "2026 – Present",
      bullets: [
        "Designing and building an AI-native ops platform for Shopify brands and its design system — an agent layer with human-in-the-loop approvals, plus a generative-creative pipeline for ad refresh",
        "Next.js · React · TypeScript · Prisma · Meta Graph API · Shopify API · Vercel",
      ],
    },
    {
      company: "Parfade",
      role: "Founder",
      period: "2026 – Present",
      bullets: [
        "Designed, built, and shipped an iOS app for golfers — round scheduling, side games, real-time chat — live on the App Store",
        "Expo · React Native · Next.js API · Drizzle · Neon Postgres · Ably",
      ],
    },
  ] satisfies ResumeJob[],
  earlierCareerIntro:
    "Fifteen years directing brand, campaign, and digital work in agencies and in-house teams before founding.",
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
    "Design & creative":
      "Art direction, brand identity, UI / UX, motion, hand illustration — Figma, Procreate",
    Engineering:
      "Next.js, React, TypeScript, Node, Postgres, React Native, design systems",
    AI: "Cursor & Claude Code for build; Seedance, Kling, Nano Banana via fal.ai for creative",
    Integrations:
      "Shopify, Meta Marketing API, EasyPost, Stripe — hand-built, in production",
  },
  footerTagline:
    "Design, code, and creative direction — concept to shipped.",
  availability: "Los Angeles · Available across North America",
};

export const RESUME_PDF_FILENAME = "Dhanai-Holtzclaw-Anchor-Resume.pdf";
export const RESUME_PDF_PUBLIC_PATH = `/assets/resume/${RESUME_PDF_FILENAME}`;
