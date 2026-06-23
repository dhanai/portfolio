export type CaseStudySection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
  year: string;
  role: string;
  externalUrl?: string;
  diagram?: string;
  sections: CaseStudySection[];
  reflection: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "takeout-order",
    title: "Takeout Order",
    subtitle: "Hand-drawn apparel brand scaled to $3.8M since 2020",
    tags: ["Brand", "Hand-drawn design", "DTC", "Growth"],
    year: "2020–2024",
    role: "Founder · Designer · Marketer · Operator",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Takeout Order was a direct-to-consumer apparel brand I founded and ran end-to-end. Every design in the catalog was hand-drawn by me — no agency, no stock art. I owned product design, paid social, email, and day-to-day operations as the brand grew to $3,788,518.88 in gross sales since January 2020.",
          "The work sat at the intersection of craft and performance: creative that had to convert, refresh before it fatigued, and stay true to a hand-made identity in a crowded DTC market.",
        ],
      },
      {
        heading: "Problem",
        paragraphs: [
          "Differentiate without a corporate team or agency overhead. Keep creative fresh as ad performance evolved. Scale fulfillment without losing the quality and coordination that early growth depended on.",
        ],
      },
      {
        heading: "Approach",
        paragraphs: [
          "I built the brand around a distinctive visual language — hand-drawn illustrations that felt personal and irreplicable. That craft became the product moat, but growth required systematic iteration on what worked.",
        ],
        bullets: [
          "Hand-drew the full catalog and directed brand identity across web, paid social, and email",
          "Ran performance marketing with iterative creative testing — catalog winners, refresh cycles, channel optimization",
          "Managed catalog lifecycle as designs peaked and needed replacement",
          "When ops broke at scale, built internal fulfillment software instead of forcing off-the-shelf tools to fit",
        ],
      },
      {
        heading: "Outcome",
        paragraphs: [
          "$3,788,518.88 in gross sales since January 2020. The brand taught me that creative work isn't abstract — it's the ad that fatigues, the product page that converts or doesn't, and the trust people feel when something feels made by hand. That lens directly informs how I think about Margenie's Ad Ops and refresh recommendations today.",
        ],
      },
    ],
    reflection:
      "Brand is performance under pressure. Takeout Order is why I care about steerable systems — recommendations you can inspect, not black-box optimization.",
  },
  {
    slug: "fulfillment-portal",
    title: "Fulfillment portal",
    subtitle: "B2B tooling for third-party print partners",
    tags: ["B2B", "AngularJS", "Firebase", "Shopify", "EasyPost"],
    year: "2019–2024",
    role: "Sole builder · Product · Engineering",
    diagram: "/assets/diagrams/fulfillment-flow.svg",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "When Takeout Order outgrew email chains and spreadsheets, I built the tool my print partners actually used every day — a B2B web portal for receiving jobs, printing, packing, and shipping order volume without engineering support.",
        ],
      },
      {
        heading: "Problem",
        paragraphs: [
          "Third-party printers needed one place to receive jobs, print, pack, and ship — without spreadsheet chaos or constant back-and-forth with the brand. Non-technical operators had to run daily fulfillment reliably.",
        ],
      },
      {
        heading: "Architecture",
        paragraphs: [
          "Shopify orders flow through Firebase Cloud Functions into the printer portal. Operators move orders through a clear state machine — received → in production → shipped or exception — and generate EasyPost shipping labels from the same interface.",
        ],
        bullets: [
          "Order state machine with exception handling for production issues",
          "Shopify order ingest and status sync",
          "EasyPost label generation and carrier tracking",
          "UX designed for non-engineers — large actions, clear status, minimal cognitive load",
        ],
      },
      {
        heading: "Stack & honesty",
        paragraphs: [
          "The portal ran in production for years on AngularJS and Firebase because it was reliable and I could maintain it solo. My greenfield work is TypeScript and Next.js — I'm not precious about frameworks, I'm precise about systems that don't break when an operator misses a click.",
        ],
      },
      {
        heading: "Outcome",
        paragraphs: [
          "Print partners used the portal daily for fulfillment. It reduced manual coordination between brand, printers, and carriers — unglamorous, load-bearing software shaped around how people actually work.",
        ],
      },
    ],
    reflection:
      "Internal tools that non-engineers depend on; structured data; partner workflows — the same shape as CMS ops and creative tooling at scale.",
  },
  {
    slug: "margenie",
    title: "Margenie",
    subtitle: "Agent-native brand operations for Shopify merchants",
    tags: ["Next.js", "Agents", "Design system", "Meta", "Shopify"],
    year: "2024–present",
    role: "Founder · Design Engineer",
    externalUrl: "https://www.margenie.co",
    diagram: "/assets/diagrams/margenie-agent-flow.svg",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Margenie is the ops brain I wished I had running Takeout Order — agent-native, approval-first, and design-system driven. It's a Next.js platform for Shopify brands juggling profit metrics, Meta ad diagnostics, creative refresh, and shipping across scattered tools.",
        ],
      },
      {
        heading: "Problem",
        paragraphs: [
          "AI assistants suggest changes but don't integrate with real workflows. Brands need recommendations they can inspect, changes they approve before they go live, and mechanics explained in plain language instead of black-box optimization.",
        ],
      },
      {
        heading: "Solution",
        paragraphs: [
          "Four pillars define the product: an Ops design system (OpsCard, checklists, mechanic pills), Supercomputer agent layer (playbooks, ranked fixes, streaming tool execution), Ad Ops with Meta mechanics (learning phase, overlap, breakdown insights), generative creative for ad refresh (fal.ai — Nano Banana 2 for image, Seedance 2 for video), and deep integrations with Shopify, Meta, and EasyPost.",
        ],
        bullets: [
          "Human-in-the-loop: propose → explain mechanic → approve → execute",
          "Generative creative pipeline (fal.ai) for image and video refresh — same approval gate before publish",
          "declare_work_plan / checklist UX for visible agent progress",
          "Meta delivery diagnostics module with learning-stage sync",
          "Shared style guide and components across Ad Ops and chat surfaces",
        ],
      },
      {
        heading: "Stack",
        paragraphs: [
          "Next.js, React, TypeScript, Prisma, Meta Graph API, Shopify API — deployed on Vercel. I own architecture, design, and implementation; AI tools accelerate coding but every production decision and craft choice is mine.",
        ],
      },
      {
        heading: "Outcome",
        paragraphs: [
          "Production SaaS at margenie.co. Closest analog to Claude-powered workflows + design system code + MCP-style tools — steerable automation where humans stay accountable.",
        ],
      },
    ],
    reflection:
      "Margenie never auto-pauses a Meta campaign — it proposes, explains the mechanic, and waits for approval. That's the kind of AI I want to help express on the web.",
  },
  {
    slug: "parfade",
    title: "Parfade",
    subtitle: "iOS app for golfers — rounds, side games, friends",
    tags: ["iOS", "Expo", "Golf", "Social"],
    year: "2023–present",
    role: "Founder · Product · Mobile",
    externalUrl: "https://www.parfade.com",
    diagram: "/assets/diagrams/parfade-loop.svg",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Golf is social; coordination and side games shouldn't live in group texts. Parfade is an iOS app I built for golfers to schedule rounds with friends, run side games during play, and share lightweight social updates.",
        ],
      },
      {
        heading: "Problem",
        paragraphs: [
          "Scheduling rounds, inviting friends, and running games (dots, skins, etc.) across fragmented tools — texts, spreadsheets, standalone scorecard apps — broke the social loop that makes golf fun.",
        ],
      },
      {
        heading: "Core loop",
        paragraphs: [
          "Plan round → invite friends → play round with side games → results and social feed. Each step is designed for speed on the course and clarity off it.",
        ],
        bullets: [
          "Round scheduling with calendar integration",
          "Invites and group coordination",
          "Side games and live game sessions",
          "Real-time chat (Ably), push notifications, activity feed",
        ],
      },
      {
        heading: "Stack",
        paragraphs: [
          "Expo / React Native for iOS, Next.js API backend with Drizzle ORM and Neon Postgres. Shipped to TestFlight and App Store — prototype quickly, design the interaction, ship, learn.",
        ],
      },
      {
        heading: "Outcome",
        paragraphs: [
          "A consumer product that complements the B2B and brand-ops work — proof I can design interaction loops, not just dashboards. Relevant to interactive marketing surfaces and rapid prototyping culture.",
        ],
      },
    ],
    reflection:
      "Consumer UX demands clarity under distraction — on a golf course, in a feed, in a notification. Same discipline applies to marketing surfaces that need to work in seconds.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
