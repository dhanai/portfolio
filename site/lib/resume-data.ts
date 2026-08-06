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
  headline: "Art Direction · Product Design",
  subheadline:
    "Brand systems · campaign craft · product UX · AI generative creative · concept to shipped",
  contact: {
    location: "Los Angeles, CA",
    email: siteConfig.links.email,
    phone: siteConfig.links.phone,
    linkedin: "linkedin.com/in/dhanai",
    github: "github.com/dhanai",
    portfolio: siteConfig.url.replace("https://", ""),
  },
  summary:
    "Creative lead who owns how it looks and how it works — art direction, product design, and the build when that's faster than briefing it. Twenty years across broadcast, advertising, web, and product: agency creative direction, founder-led brands, and production software operators use every day. Built and art-directed a hand-drawn apparel brand to $3.8M in lifetime sales while designing the fulfillment systems behind it. Today I direct AI-native generative campaigns and ship product surfaces in Next.js — brand craft and product judgment in the same loop.",
  experience: [
    {
      company: "Takeout Order",
      role: "Founder & Creative / Product Lead",
      period: "2020 — Present",
      bullets: [
        "Built the brand end to end — identity, voice, and a full hand-drawn product catalog — and scaled it to $3.8M in lifetime sales.",
        "Wrote and art-directed campaigns across paid social, web, email, and packaging; ran continuous creative testing where fresh concepts were the primary growth lever.",
        "Designed and shipped the B2B fulfillment portal operators use daily — Shopify ingest, labels, and an order state machine — when off-the-shelf tools broke at scale.",
        "Directed hundreds of shoots, live-action and AI-generated, building a repeatable system for on-brand generative video and imagery.",
      ],
    },
    {
      company: "Doomsy",
      role: "Founder · Product Design & Creative",
      period: "2026 — Present",
      bullets: [
        "Designed and shipped a creative feed product for brands — catalog ingest, private feed, like/pass loop, and natural-language image edits.",
        "Owned product UX and creative quality bar: on-brand photos and reels without a shoot, with taste and systems thinking in the same surface.",
      ],
    },
    {
      company: "Well Shucks",
      role: "Founder & Creative Director",
      period: "2026 — Present",
      bullets: [
        'Launched a second apparel brand from positioning through storefront — "tragically nostalgic: vintage children\'s illustrations for adults with behavioral issues."',
      ],
    },
    {
      company: "DJcity",
      role: "Creative Director",
      period: "2013 — 2019",
      bullets: [
        "Owned brand, campaign, and product creative for a DJ music platform across six years — a startup creative function I built and ran.",
        "Directed DJcity TV's on-air identity and partnered daily with engineering to take creative from concept to shipped product surfaces.",
        "Art-directed The Cutting Room title package end to end, from type design through final composited delivery.",
      ],
    },
    {
      company: "Ciplex",
      role: "Creative Director",
      period: "2010 — 2013",
      bullets: [
        "Designed and art-directed the web experiences for ArcLight Cinemas and Grauman's Chinese Theatre, alongside brand, campaign, and digital work for a roster of small-business clients.",
      ],
    },
  ] satisfies ResumeJob[],
  earlierCareerIntro:
    "Agency and studio work across interactive, brand, and editorial design during the Flash-to-web transition.",
  earlierCareer: [
    { company: "Mego", role: "Creative Director", period: "2009 — 2010" },
    { company: "Getback", role: "Art Director", period: "2008 — 2009" },
    { company: "Hello Design", role: "Lead Designer", period: "2007 — 2008" },
    { company: "Cytek Studios", role: "Lead Designer", period: "2005 — 2007" },
    { company: "Resultz", role: "Interactive Designer", period: "2003 — 2005" },
  ] satisfies EarlierJob[],
  skills: {
    Creative:
      "Art direction, brand identity, campaign concepting, copywriting, editorial & layout, hand illustration, motion (After Effects)",
    Product:
      "Product UX, information architecture, flows & prototypes, design systems, usability judgment, Figma",
    "AI creative":
      "Generative video & image direction — Seedance, Kling, Nano Banana, Flux via fal.ai & Runware; AI as production accelerant",
    "Design tools":
      "Figma, Photoshop, Illustrator, After Effects, Premiere, InDesign, Procreate",
    Build: "Next.js, React, TypeScript, Shopify, Meta Ads — ships production software solo when needed",
  },
  footerTagline: "How it looks · how it works — and the ability to ship both.",
  availability: "Los Angeles · Available across North America",
};

export const RESUME_PDF_FILENAME = "Dhanai-Resume-Art-Direction-Product-Design.pdf";
export const RESUME_PDF_PUBLIC_PATH = `/assets/resume/${RESUME_PDF_FILENAME}`;
