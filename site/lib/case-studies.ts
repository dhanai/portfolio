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
      "AI production system for animated series — consistency as a product problem",
    tags: ["Product", "Brand", "AI", "Direction"],
    year: "2026–present",
    role: "Creator · Product Design · Creative Direction",
    heroImage:
      "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/studio-lightbox.webp",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Studio is a production workspace for DNA-driven AI animation — not a timeline editor. I cut a finished one-minute clip from about eight hours of thrash down to roughly two by treating cast continuity as a product problem, not a prompting habit.",
          "I designed and built it end to end (Next.js, Runware for Nano Banana / Seedance, agent chat) while directing original series work through it — including Felt The Music, visible in the workspace screenshot.",
        ],
      },
      {
        heading: "Problem",
        paragraphs: [
          "Saving and reusing good prompts helps a little, then falls apart when the same character needs a different outfit, or the same location at night. A template doesn’t carry visual identity. Fal playgrounds made the gap obvious: every one-off restarted from scratch.",
          "For a series you need characters and locations as entities with variants, a composer that locks references, and a path from cheap drafts to final clips — without reinventing the cast every take.",
        ],
      },
      {
        heading: "Product design",
        paragraphs: [
          "Landed on entities with variants as first-class assets. Characters, locations, and props sit in the library; Fred can have a default look and a cowboy variant. Drop him into Composer, switch the variant — don’t hunt for the still. Character sheets lock the look.",
          "Studio stays hands-on for building: pick assets, send to Composer, generate. The agent sits beside that path for questions, planning, and drafting — “group this cast at the park,” or “Fred skydiving with a parachute” — with the same library and show bible underneath. Two models, one ecosystem.",
        ],
        bullets: [
          "Hierarchy: Episodes · Clips · Characters · Locations · Props · Frames — same underlying asset model, separated to lower friction when assembling a clip",
          "Soft nested folders (leads vs side characters, Episode 1 vs Episode 2 locations)",
          "Reference slots so Seedance clips lock to approved stills, not free-floating prompts",
          "Model tiers for prototype → production; agent ops are structured and reversible",
        ],
      },
      {
        heading: "Art direction",
        paragraphs: [
          "Taste lives as data: show DNA and asset DNA are the style bible. Felt The Music keeps a coherent felted-character world across the library — direction becomes a system you browse and reuse, not only a prompt skill.",
        ],
      },
      {
        heading: "Outcome & honesty",
        paragraphs: [
          "An internal tool I’m running to ship a YouTube series faster. Validation is thin on purpose: it’s me grinding the workflow to get episodes out. The IA is the risk I’d watch closest with a new user — if they hesitate or take a wrong path, the fix is restructuring, not hover tips.",
        ],
      },
    ],
    reflection:
      "Consistency isn’t a better prompt. It’s entities, variants, and a library the agent and the hands-on path share.",
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
          "Parfade is a consumer iOS app for golfers who already have a network — Saturday regulars, the “who’s free Thursday” crowd. Getting a round together was eating more energy than the round: three group chats, half the people don’t see it, maybes pile up, and the tee time’s gone. The work isn’t golf. It’s logistics.",
          "I own product design and the full stack. The product only works if other people tap Accept — I feel the pain as a player, but I’m not the customer.",
        ],
      },
      {
        heading: "Problem",
        paragraphs: [
          "Scorecard apps don’t fix invites; invite tools don’t run games. The real failure mode was leaving negotiation outside the product.",
        ],
      },
      {
        heading: "Product decisions",
        paragraphs: [
          "First I tried the timid version: a link or poll dropped into the group thread — keep iMessage as home base, make the app a helper. It failed. People answered in the thread, the poll went stale, and the host was back to juggling.",
          "So availability became a first-class action. Pick friends or a group; Parfade pushes; first to accept are in. In-app chat stays for people already in the round. What I refused to keep was three outside chats as the booking system.",
        ],
        bullets: [
          "Invite → push → accept/decline — host sees who’s in without chasing threads",
          "Planning vs locked tee time as clear states; course and time on the notification and accept screen (after a friend accepted then texted “which course?”)",
          "Games, scoring, and recaps so the app isn’t only useful for five minutes of RSVP",
          "Groups and profiles so regular foursomes stick around after the round",
        ],
      },
      {
        heading: "Brand & craft",
        paragraphs: [
          "Visual system leans golf-club calm: cream surfaces, forest green, gold mark, script wordmark next to utilitarian UI. Lifestyle photography sets the bar; in-app chrome stays quiet so course photos and standings can lead.",
        ],
      },
      {
        heading: "Outcome & honesty",
        paragraphs: [
          "Shipped loop at parfade.com — build your people, invite, accept, play. Traction is early on purpose: no marketing yet; me and two friends is enough to feel the product break in real rounds, not enough to claim PMF.",
          "The real constraint is habit. Group chat is still the default. I don’t win by building a better messenger — I win when a host trusts a Parfade invite to fill a tee time faster than three threads.",
        ],
      },
    ],
    reflection:
      "Accept has to mean “I’m in for this round,” not “I saw a ping.” Clarity in the invite is the product.",
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
