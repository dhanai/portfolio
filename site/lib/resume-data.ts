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
  headline: "Art Director · Creative Director",
  subheadline:
    "Brand · campaign · motion · AI generative creative · concept to shipped",
  contact: {
    location: "Los Angeles, CA",
    email: siteConfig.links.email,
    phone: siteConfig.links.phone,
    linkedin: "linkedin.com/in/dhanai",
    github: "github.com/dhanai",
    portfolio: siteConfig.url.replace("https://", ""),
  },
  summary:
    "Art director and creative lead with 20+ years across broadcast, advertising, web, and product. Fifteen years directing brand and campaign work in agencies and startups — most often as the entire creative department, accountable for every asset that left the building. Built and art-directed a hand-drawn apparel brand to $3.8M in lifetime sales. I came up on Photoshop and Flash, when motion was what made a website worth visiting; After Effects followed, and I still specify easing down to the curve. Today I direct AI-native generative video and image campaigns, and build the production front end when that's faster than briefing it.",
  experience: [
    {
      company: "Takeout Order",
      role: "Founder & Creative Director",
      period: "2020 — Present",
      bullets: [
        "Built the brand end to end — identity, voice, and a full hand-drawn product catalog — and scaled it to $3.8M in lifetime sales.",
        "Wrote and art-directed campaigns across paid social, web, email, and packaging, owning every idea from concept through finished asset.",
        "Directed hundreds of shoots, live-action and AI-generated, building a repeatable system for on-brand generative video and imagery (Seedance, Kling, Nano Banana via fal.ai).",
        "Ran continuous performance-creative testing where fresh concepts were the primary growth lever, not media spend.",
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
      company: "Studio",
      role: "Creator & Director",
      period: "2026 — Present",
      bullets: [
        "Directing an original animated series — story, character design, and shot direction — and building the production system behind it: characters, locations, and props as entities with variants that hold a cast consistent across generations. Cut a finished one-minute clip from ~8 hours to ~2.",
      ],
    },
    {
      company: "DJcity",
      role: "Creative Director",
      period: "2013 — 2019",
      bullets: [
        "Owned brand, campaign, and product creative for a DJ music platform across six years — a startup creative function I built and ran.",
        "Directed DJcity TV's on-air identity: logo animation, show bumpers, and title sequences built in After Effects and delivered to broadcast spec — 25fps masters and alpha-channel titles cut into editorial.",
        "Art-directed The Cutting Room title package end to end, from type design through final composited delivery.",
        "Directed a production designer and partnered daily with an in-house developer to take creative from concept to shipped product surfaces.",
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
      "Art direction, brand identity, campaign concepting, copywriting, editorial & layout, hand illustration",
    "Motion & AV":
      "After Effects — title sequences, broadcast graphics, logo animation. Easing and timing with sharp exponential curves; AE curves into CSS or Framer Motion. Premiere for edit; Ableton and Cubase for audio.",
    "AI creative":
      "Generative video & image direction — Seedance, Kling, Nano Banana, Flux via fal.ai & Runware; prompt direction for motion, fabric, and graphic fidelity.",
    "Design tools":
      "Photoshop, Illustrator, After Effects, Premiere, InDesign, Procreate, Figma",
    Build: "Next.js, React, TypeScript, Shopify, Meta Ads",
    "Also builds":
      "Ships production software solo — Parfade (live iOS app), Studio, and B2B fulfillment tooling, in Next.js / React. I can prototype the idea, not just brief it.",
  },
  footerTagline: "Concept · craft · direction — and the ability to ship it.",
  availability: "Los Angeles · Available across North America",
};

export const RESUME_PDF_FILENAME = "Dhanai-Holtzclaw-Art-Director-Resume-v2.pdf";
export const RESUME_PDF_PUBLIC_PATH = `/assets/resume/${RESUME_PDF_FILENAME}`;
