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
  headline: "Art Director & Product Designer",
  subheadline: "Brand, campaigns, product UX, and AI creative",
  contact: {
    location: "Los Angeles, CA",
    email: siteConfig.links.email,
    phone: siteConfig.links.phone,
    linkedin: "linkedin.com/in/dhanai",
    portfolio: siteConfig.url.replace("https://", ""),
  },
  summary:
    "Art director and product designer with 20 years across broadcast, advertising, web, and product. I built a hand-drawn apparel brand to $3.8M in sales and designed the fulfillment software behind it. Now I design and build Doomsy, an iOS app for directing AI films. I take work from the first idea to the shipped thing.",
  experience: [
    {
      company: "Takeout Order",
      role: "Founder · Creative & Product Lead",
      period: "2020 — Present",
      bullets: [
        "Built the brand end to end, from identity and voice to a hand-drawn catalog, and grew it to $3.8M in lifetime sales.",
        "Wrote and art-directed campaigns across paid social, web, email, and packaging. New concepts were the main growth lever, so I tested them constantly.",
        "Designed and shipped the fulfillment portal operators use daily: Shopify ingest, labels, and an order state machine.",
        "Directed hundreds of shoots, live-action and AI-generated, with a repeatable system for on-brand video and imagery.",
      ],
    },
    {
      company: "Doomsy",
      role: "Founder · Product Design & Creative Direction",
      period: "2026 — Present",
      bullets: [
        "Designing and building an iOS app for directing short AI films: previs, cast, scenes, takes, voices, music, and a phone-sized editor.",
        "Modeled it on a real production. Ask, the built-in assistant, can fill in any step, but the director still presses Generate.",
        "Rebuilt it from an on-brand content feed for brands once image models made that easy for everyone.",
      ],
    },
    {
      company: "DJcity",
      role: "Creative Director",
      period: "2013 — 2019",
      bullets: [
        "Ran brand, campaign, and product creative for a DJ music platform for six years, building the creative function in-house.",
        "Directed the DJcity TV on-air identity and worked daily with engineering to ship product surfaces.",
      ],
    },
    {
      company: "Ciplex",
      role: "Creative Director",
      period: "2010 — 2013",
      bullets: [
        "Designed and art-directed web experiences for ArcLight Cinemas and Grauman's Chinese Theatre, plus brand and campaign work for small businesses.",
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
    "Art direction":
      "Brand identity, campaign concepting, copywriting, editorial layout, hand illustration, motion",
    "Product design":
      "Product UX, information architecture, flows, prototypes, design systems",
    "AI creative":
      "Generative video and image direction with Seedance, Kling, Nano Banana, and Flux",
    Tools: "Figma, Photoshop, Illustrator, After Effects, Premiere, InDesign, Procreate",
    Build: "Next.js, React, TypeScript, Shopify",
  },
  footerTagline: "Los Angeles · Available across North America",
  availability: "Los Angeles · Available across North America",
};

export const RESUME_PDF_FILENAME = "Dhanai-Holtzclaw-Resume-Art-Product.pdf";
export const RESUME_PDF_PUBLIC_PATH = `/assets/resume/${RESUME_PDF_FILENAME}`;
