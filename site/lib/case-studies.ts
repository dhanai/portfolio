export type CaseStudySection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type CaseStudyGalleryItem = {
  src: string;
  alt: string;
  caption?: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
  year?: string;
  role: string;
  externalUrl?: string;
  /** Optional architecture diagram (SVG/URL) */
  diagram?: string;
  /** Optional hero screenshot shown under the header */
  heroImage?: string;
  /** Optional product screens (phone / UI gallery) */
  gallery?: CaseStudyGalleryItem[];
  sections: CaseStudySection[];
  reflection: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "takeout-order",
    title: "Takeout Order",
    subtitle: "Brand system, growth creative, and fulfillment product — $3.8M",
    tags: ["Brand", "Product", "DTC", "Growth"],
    year: "2020–present",
    role: "Founder · Art Direction · Product Design",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Takeout Order is a direct-to-consumer apparel brand I founded and still run end-to-end. Every design in the catalog is hand-drawn by me. I own brand, paid social, email, and the product surfaces that keep the business running — including a B2B fulfillment portal print partners use every day. Gross sales since January 2020: $3,788,518.88.",
          "The work sits where art direction and product design meet: creative that has to convert, systems operators can trust, and a visual language that stays coherent under performance pressure.",
        ],
      },
      {
        heading: "Problem",
        paragraphs: [
          "Differentiate without a corporate team. Keep creative fresh as ads fatigued. Scale fulfillment without losing coordination — email chains and spreadsheets broke first.",
        ],
      },
      {
        heading: "Brand approach",
        paragraphs: [
          "Built the brand around hand-drawn illustration as the moat — identity, catalog, packaging, and campaign craft owned in one seat.",
        ],
        bullets: [
          "Hand-drew the full catalog and directed brand identity across web, paid social, and email",
          "Art-directed live-action and AI-generated shoots into a repeatable on-brand production system",
          "Ran continuous performance-creative testing where fresh concepts were the primary growth lever",
        ],
      },
      {
        heading: "Product approach",
        paragraphs: [
          "When ops broke at scale, I designed and built the fulfillment product instead of forcing off-the-shelf tools to fit — Shopify ingest, EasyPost labels, and an order state machine operators run unattended.",
        ],
        bullets: [
          "Mapped partner workflows and edge cases with real operators",
          "Designed clear states for receive → print → pack → ship",
          "Shipped production software solo so creative and ops stayed in one feedback loop",
        ],
      },
      {
        heading: "Outcome",
        paragraphs: [
          "$3.8M+ lifetime sales and a brand still running. Proof that craft, campaign systems, and product UX can live in the same founder seat — and that taste without operable systems doesn't scale.",
        ],
      },
    ],
    reflection:
      "Brand is performance under pressure. Product is the system that keeps the brand shippable. Takeout is why I don't separate art direction from product design.",
  },
  {
    slug: "doomsy",
    title: "Doomsy",
    subtitle: "Product UX for an AI creative feed — brand taste as the quality bar",
    tags: ["Product", "Brand", "AI"],
    year: "2026–present",
    role: "Founder · Product Design · Creative Direction",
    externalUrl: "https://doomsy.ai",
    heroImage:
      "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/doomsy-hero.webp",
    gallery: [
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/doomsy/landing.webp",
        alt: "Doomsy mobile onboarding — Your brand’s content, on easy mode",
        caption: "Onboarding — drop a URL, free to try",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/doomsy/feed.webp",
        alt: "Doomsy home feed with product stories and Well Shucks post",
        caption: "Home feed — stories + product posts",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/doomsy/feed-post.webp",
        alt: "Doomsy feed post for Crashing Out T-shirt with like and pass actions",
        caption: "Post detail — like, pass, edit, share",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/doomsy/story.webp",
        alt: "Doomsy story view for Touching Grass T-shirt",
        caption: "Stories — full-bleed product moments",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/doomsy/reel.webp",
        alt: "Doomsy reels with Generate, Like, and Pass",
        caption: "Reels — Generate + like/pass loop",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/doomsy/edit-image.webp",
        alt: "Doomsy edit image sheet — describe the change in plain English",
        caption: "Edit image — plain-English revisions",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/doomsy/agent-chat.webp",
        alt: "Doomsy agent chat creating a post with art-direction brief",
        caption: "Agent chat — brief, queue, deliver",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/doomsy/director.webp",
        alt: "Doomsy director settings — autonomous fill and model tiers",
        caption: "Director — autonomous fill + model pick",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/doomsy/brand-settings.webp",
        alt: "Doomsy brand settings — voice, cast, insights, liked, hidden",
        caption: "Brand system — voice, cast, insights",
      },
    ],
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Doomsy is a creative feed for brands: paste a catalog link, get on-brand photos and reels in a private feed. Like the keepers, pass on the rest — no prompt box as the main UI.",
          "I designed the product loop and set the creative quality bar so generative output feels directed, not dumped. The screens below walk the path from onboarding through feed, reels, edits, agent chat, and director controls.",
        ],
      },
      {
        heading: "Problem",
        paragraphs: [
          "Shop owners know what good looks like but don't have a studio on call. Existing tools still center prompts and bulk farms — not a feed they already understand, steered by taste.",
        ],
      },
      {
        heading: "Product design",
        paragraphs: [
          "Centered the experience on a private feed and a like/pass loop that improves what comes next — catalog ingest, brand voice you can read, and natural-language edits without a reshoot.",
        ],
        bullets: [
          "Signup → drop brand link → first posts → scroll / like / hide → save or ship",
          "Clear hierarchy for photos, carousels, and reels in one feed",
          "Edit-in-plain-English as a product affordance, not a hidden power feature",
          "Director mode for autonomous fill, model tiers, cast sheets, and brand voice",
        ],
      },
      {
        heading: "Creative direction",
        paragraphs: [
          "Treated generative production like a shoot: brand photography and voice as inputs, fidelity to product and fabric as constraints, taste as the acceptance criteria. Well Shucks posts in the product are the same art direction language as the brand — deadpan, nostalgic, on-product.",
        ],
      },
      {
        heading: "Outcome",
        paragraphs: [
          "A live product at doomsy.ai that demonstrates product UX and art direction in one surface — useful for both product-design and brand/creative hiring conversations.",
        ],
      },
    ],
    reflection:
      "AI creative only works when product design protects taste. Doomsy is the feed pattern I wanted as a creative director — and built as a product designer.",
  },
  {
    slug: "studio",
    title: "Studio",
    subtitle:
      "AI production system for animated series — characters, locations, and clips as durable entities",
    tags: ["Product", "Brand", "AI", "Direction"],
    year: "2026–present",
    role: "Creator · Product Design · Creative Direction",
    heroImage:
      "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/studio-lightbox.webp",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Studio is a full-screen production workspace for DNA-driven AI animation — not a timeline editor. You generate stills and clips against a show bible, then export to Premiere. Shows hold episodes, characters, locations, props, voices, and segments; each generation inherits the same visual DNA so a cast stays consistent across shots.",
          "I designed and built the product end to end (Next.js, Runware for Nano Banana / Seedance, agent chat with reversible ops) while directing original series work through it — including Felt The Music, visible in the workspace screenshot.",
        ],
      },
      {
        heading: "Problem",
        paragraphs: [
          "Generative video tools are one-shot: prompt, hope, regenerate, lose continuity. For a series you need characters and locations as entities with variants, a segment composer that locks references, and a workflow from cheap drafts to final clips — without reinventing the cast every take.",
          "Cutting a finished one-minute clip used to take ~8 hours of thrash. The system needed to cut that path to roughly ~2 hours by holding identity and structure in product, not only in prompts.",
        ],
      },
      {
        heading: "Product design",
        paragraphs: [
          "Full-screen workspace with a clear IA: library sidebar (episodes, characters, locations, props), center canvas for preview + filmstrip + prompt dock, and a right rail for DNA, references, model tiers, and agent chat.",
        ],
        bullets: [
          "Entity model: Show → Episode → Assets (characters / locations / props) + Segments → Generations",
          "Reference slots (@image) so Seedance clips lock to approved stills, not free-floating prompts",
          "Model tiers for prototype → production (Lite stills / Mini clips → hero NB2 + Seedance 2)",
          "Agent chat proposes structured, reversible ops with before/after diffs — accept or reject, don't bury the run in chat prose",
          "Enhance path: rough prompt → Claude Fable expand → editable Seedance prompt → generate",
        ],
      },
      {
        heading: "Art direction",
        paragraphs: [
          "Studio encodes taste as data: show DNA and asset DNA are the style bible. Felt The Music uses a coherent felted-character world across the asset library — the product surfaces that consistency so direction isn't only a prompt skill, it's a system you can browse and reuse.",
        ],
      },
      {
        heading: "Outcome",
        paragraphs: [
          "A production tool that treats generative AI like a pipeline, not a slot machine — and a portfolio proof that product UX and creative direction can share one seat. Continuity, tiers, and reviewable agent ops are the design; the screenshot is the workspace in use on a real show.",
        ],
      },
    ],
    reflection:
      "A show runner that knows better than you do — because the characters, locations, and DNA live in the product, not only in your head.",
  },
  {
    slug: "fulfillment-portal",
    title: "Fulfillment portal",
    subtitle: "B2B tooling for third-party print partners",
    tags: ["Product", "B2B", "Ops", "Shopify"],
    year: "2020–present",
    role: "Sole builder · Product · Engineering",
    diagram: "/assets/diagrams/fulfillment-flow.svg",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "When Takeout Order outgrew email chains and spreadsheets, I built the tool my print partners use every day — a B2B web portal for receiving jobs, printing, packing, and shipping order volume without engineering support.",
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
          "The portal runs in production on AngularJS and Firebase because it is reliable and I can maintain it solo. My greenfield work is TypeScript and Next.js — I'm not precious about frameworks, I'm precise about systems that don't break when an operator misses a click.",
        ],
      },
      {
        heading: "Outcome",
        paragraphs: [
          "Print partners use the portal daily for fulfillment. It reduces manual coordination between brand, printers, and carriers — unglamorous, load-bearing software shaped around how people actually work.",
        ],
      },
    ],
    reflection:
      "Internal tools that non-engineers depend on; structured data; partner workflows — the same shape as CMS ops and creative tooling at scale.",
  },
  {
    slug: "margenie",
    title: "Margenie",
    subtitle: "Agent-native brand operations · work in progress",
    tags: ["Next.js", "Agents", "Design system", "Meta", "Shopify"],
    year: "2026–present",
    role: "Founder · Design Engineer",
    externalUrl: "https://www.margenie.co",
    diagram: "/assets/diagrams/margenie-agent-flow.svg",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Margenie is the ops brain I wished I had running Takeout Order — agent-native, approval-first, and design-system driven. I'm building it as a Next.js platform for Shopify brands juggling profit metrics, Meta ad diagnostics, creative refresh, and shipping across scattered tools.",
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
          "Active development at margenie.co — production SaaS with more surface area shipping regularly. Closest analog to Claude-powered workflows + design system code + MCP-style tools — steerable automation where humans stay accountable.",
        ],
      },
    ],
    reflection:
      "Margenie never auto-pauses a Meta campaign — it proposes, explains the mechanic, and waits for approval. That's the kind of AI I want to help express on the web.",
  },
  {
    slug: "parfade",
    title: "Parfade",
    subtitle: "Product design for golf social — plan rounds, side games, groups",
    tags: ["Product", "iOS", "Social"],
    year: "2026–present",
    role: "Founder · Product Design · Mobile",
    externalUrl: "https://www.parfade.com",
    diagram: "/assets/diagrams/parfade-loop.svg",
    heroImage:
      "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/parfade-hero.webp",
    gallery: [
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/parfade/landing.webp",
        alt: "Parfade splash — Golf plans without the group text chaos",
        caption: "Positioning — plans without group-text chaos",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/parfade/discover.webp",
        alt: "Parfade Discover feed with planning and instant rounds",
        caption: "Discover — open rounds looking for players",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/parfade/my-rounds.webp",
        alt: "Parfade My Rounds — planning and confirmed tee times",
        caption: "My rounds — planning vs locked tee times",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/parfade/create-round.webp",
        alt: "Parfade Planning Round form with time, visibility, and join policy",
        caption: "Create — find players first, lock details later",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/parfade/invite.webp",
        alt: "Parfade Invite Friends bottom sheet",
        caption: "Invites — search and add friends in-flow",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/parfade/games.webp",
        alt: "Parfade Games hub with Skins, Wolf, Nassau, and more",
        caption: "Games — Skins, Wolf, Nassau, Sixes…",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/parfade/activity.webp",
        alt: "Parfade activity feed with Wolf standings",
        caption: "Activity — game results and standings",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/parfade/groups.webp",
        alt: "Parfade Groups — My Groups list",
        caption: "Groups — communities for regular play",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/parfade/profile.webp",
        alt: "Parfade profile with handicap, followers, and activity",
        caption: "Profile — handicap, social graph, hosting",
      },
    ],
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Parfade is a consumer iOS app for golfers: schedule rounds, invite friends, run side games on the course, and keep the social loop in one place instead of group texts and scattered score apps.",
          "I own product design and the full stack — Expo / React Native client, Next.js API, Neon Postgres. The screens below walk Discover → My Rounds → Create → Games → Groups → Profile.",
        ],
      },
      {
        heading: "Problem",
        paragraphs: [
          "Golf is social, but coordination is chaos. Tee times land in texts; who’s in is unclear; skins and Wolf live in someone else’s head or a note app. Scorecard tools don’t fix invites; invite tools don’t run games.",
        ],
      },
      {
        heading: "Product design",
        paragraphs: [
          "Designed for two contexts: thumbing a phone on the range, and glancing between shots. Segmented controls over menus. Clear states for “still planning” vs “locked tee time.” Side games as first-class products, not buried features.",
        ],
        bullets: [
          "Planning-first create flow — date, morning/afternoon/twilight, visibility, join policy, then friends",
          "Discover and My Rounds share the same card language so open and hosted rounds feel related",
          "Games hub for Skins, Wolf, Best ball, Nassau, Sixes, Match Play, Vegas, Dots — with session history",
          "Groups and profiles so regular foursomes and handicap/social identity stick around after the round",
        ],
      },
      {
        heading: "Brand & craft",
        paragraphs: [
          "Visual system leans golf-club calm: cream surfaces, forest green accents, gold mark, script wordmark next to utilitarian UI type. Lifestyle photography on the splash sets the premium bar; in-app chrome stays quiet so course photos and game standings can lead.",
        ],
      },
      {
        heading: "Stack",
        paragraphs: [
          "Expo / React Native for iOS, Next.js API with Drizzle and Neon, Ably for realtime, Clerk for auth, Expo push for invites. Ship → learn on-course → tighten the loop.",
        ],
      },
      {
        heading: "Outcome",
        paragraphs: [
          "A live consumer product at parfade.com — proof of end-to-end product design for a social loop, not just dashboards or brand decks. Complements the B2B and brand-ops work with a mobile interaction case.",
        ],
      },
    ],
    reflection:
      "On a golf course the UI has seconds, not minutes. Same constraint as marketing surfaces that have to land on first glance — clarity under distraction.",
  },
  {
    slug: "petshirts",
    title: "Petshirts",
    subtitle:
      "AI pet art → print-ready apparel — photo to Shopify checkout",
    tags: ["Product", "Brand", "AI", "E-commerce"],
    year: "2026–present",
    role: "Founder · Product Design · Brand",
    externalUrl: "https://www.petshirts.co",
    heroImage:
      "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/petshirts-hero.webp",
    gallery: [
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/petshirts/landing-mobile.webp",
        alt: "Petshirts mobile landing — Your pet deserves to be on a t-shirt",
        caption: "Landing — CTA and social proof",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/petshirts/styles.webp",
        alt: "Petshirts Pick a style — Howling, Victorian, and more",
        caption: "Styles — browse the art library",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/petshirts/upload.webp",
        alt: "Petshirts Start with your pet upload modal",
        caption: "Upload — start with a pet photo",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/petshirts/preview-howling.webp",
        alt: "Petshirts Howling design preview on black tee",
        caption: "Preview — design on garment",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/petshirts/preview-rap.webp",
        alt: "Petshirts Rap Tee collage with Regenerate and Add to cart",
        caption: "Generate — regenerate until it hits",
      },
      {
        src: "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/petshirts/cart.webp",
        alt: "Petshirts cart — Howling T-Shirt Black checkout",
        caption: "Cart — checkout via Shopify",
      },
    ],
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Petshirts turns a phone photo of your pet into wearable art: pick an AI style, preview it on a real garment, choose sizes, and check out through Shopify. Tagline energy: your pet deserves to be on a t-shirt.",
          "I designed and built the storefront, brand system, style/prompt library, admin CMS, and print pipeline end to end — Next.js, Runware, Neon, Vercel Blob, Shopify.",
        ],
      },
      {
        heading: "Problem",
        paragraphs: [
          "Pet parents want identity-faithful merch of their animal, not generic stock art. Traditional custom shops are slow or designer-gated; most AI demos stop at a pretty image and never get to print-ready commerce.",
        ],
      },
      {
        heading: "Product design",
        paragraphs: [
          "Collapsed the path to ~three minutes: upload → style → garment/color/size → cart → checkout. Previews generate at 1K for speed; after payment a 4K print file is prepared for fulfillment.",
        ],
        bullets: [
          "Style-first browse and create flows so taste leads, not SKU grids",
          "Live flat-lay preview on Comfort Colors blanks (tee, sweatshirt, long sleeve)",
          "Collections (Bootleg, Gallery, Saturday Morning, Fridge Door, Holiday, Club…) with a prompt library behind the UI",
          "Headless Shopify checkout with design URLs on line items for operators",
        ],
      },
      {
        heading: "Brand & craft",
        paragraphs: [
          "Playful pet-parent voice with a loud pink primary, yellow chips, and Unbounded + DM Sans. Marketing sells joy; the product chrome stays quiet so the AI art and garment photos can lead.",
        ],
      },
      {
        heading: "Ops & stack",
        paragraphs: [
          "Admin CMS for styles, collections, garments, mockup lab, and landing copy. Abuse prevention via Turnstile and rate limits. Stack: Next.js 15, Runware (Fal fallback), Neon Postgres, Vercel Blob, Shopify Storefront + webhooks.",
        ],
      },
      {
        heading: "Outcome",
        paragraphs: [
          "Production-ready private build at petshirts.co — launch-gated while catalog and print ops lock. Portfolio proof of DTC product design where brand, generative craft, and checkout share one seat.",
        ],
      },
    ],
    reflection:
      "AI apparel only works when the preview feels like a product and the order note carries a print file. Taste without fulfillment is a demo.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}

export function getCaseStudyDiagram(slug: string): string | undefined {
  return caseStudies.find((c) => c.slug === slug)?.diagram;
}
