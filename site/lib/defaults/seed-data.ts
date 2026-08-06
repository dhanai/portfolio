import type { CaseStudySection } from "@/lib/case-studies";
import { caseStudies } from "@/lib/case-studies";
import { projects } from "@/lib/projects";
import { resumeData } from "@/lib/resume-data";
import { siteConfig } from "@/lib/site-config";

export type SiteContentData = {
  name: string;
  fullName: string;
  title: string;
  description: string;
  url: string;
  oneLiner: string;
  links: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    instagram: string;
    margenie: string;
    parfade: string;
  };
  hero: {
    label: string;
    title: string;
    titleMuted: string;
  };
  /** How many published work items to show on the homepage Selected work grid */
  homepageWorkCount: number;
  now: {
    label: string;
    title: string;
    body: string;
    linkUrl: string;
    linkLabel: string;
  };
};

export type AboutContentData = {
  paragraphs: string[];
  skills: { area: string; level: string; accent: string }[];
  ctaTitle: string;
  ctaBody: string;
};

export const defaultSiteContent: SiteContentData = {
  name: siteConfig.name,
  fullName: siteConfig.fullName,
  title: siteConfig.title,
  description: siteConfig.description,
  url: siteConfig.url,
  oneLiner: siteConfig.oneLiner,
  links: { ...siteConfig.links },
  hero: {
    label: "Los Angeles",
    title: "Art direction &",
    titleMuted: "product design",
  },
  homepageWorkCount: 12,
  now: {
    label: "Now",
    title: "Building Doomsy",
    body: "A creative feed for brands — paste a catalog link, get on-brand photos and reels without a shoot.",
    linkUrl: "https://doomsy.ai",
    linkLabel: "doomsy.ai",
  },
};

export const defaultAboutContent: AboutContentData = {
  paragraphs: [
    "Los Angeles–based creative lead spanning art direction and product design. Twenty years across broadcast, advertising, web, and product — from agency creative direction at DJcity and Ciplex to founding Takeout Order, where I built the brand to $3.8M and the fulfillment software operators run every day.",
    "I art-direct brand systems and campaigns, and I design the product surfaces those brands live in — feeds, ops tools, growth loops. Came up on Photoshop and Flash; After Effects followed. Today I direct AI-native generative creative and ship front ends in Next.js when that's faster than briefing it.",
    "Doomsy, Parfade, and Studio sit alongside the brand work: proof I can own taste and systems — how it looks and how it works.",
  ],
  skills: [
    { area: "Art direction / brand", level: "Expert", accent: "#FF453A" },
    { area: "Campaign / performance creative", level: "Expert", accent: "#FF453A" },
    { area: "Product UX / systems", level: "Expert", accent: "#BF5AF2" },
    { area: "Motion / After Effects", level: "Expert", accent: "#FF9F0A" },
    { area: "AI generative creative", level: "Expert", accent: "#64D2FF" },
    { area: "Build / Next.js", level: "Strong", accent: "#0A84FF" },
  ],
  ctaTitle: "Open to opportunities",
  ctaBody:
    "Art direction, brand, and product design roles — craft and systems. Based in LA, open across North America.",
};

export const defaultResumeContent = resumeData;

export function buildDefaultWorks() {
  return projects.map((project, index) => {
    const study = caseStudies.find((c) => c.slug === project.slug);
    const cardAction =
      project.cardAction ??
      (project.href ? ("external" as const) : ("caseStudy" as const));
    const needsCaseStudy = cardAction === "caseStudy";
    if (needsCaseStudy && !study) {
      throw new Error(`Missing case study for project slug: ${project.slug}`);
    }
    return {
      slug: project.slug,
      sortOrder: index,
      published: true,
      title: project.title,
      subtitle: project.subtitle,
      tags: JSON.stringify(project.tags),
      year: project.year ?? "",
      color: project.color,
      href: cardAction === "external" ? (project.href ?? null) : null,
      image: project.image ?? null,
      cardAction,
      lightboxImage:
        cardAction === "lightbox" ? (project.lightboxImage ?? project.image ?? null) : null,
      role: study?.role ?? "Creator",
      externalUrl: study?.externalUrl ?? project.href ?? null,
      diagram: study?.diagram ?? null,
      reflection: study?.reflection ?? "",
      sections: JSON.stringify(
        (study?.sections ?? []) satisfies CaseStudySection[],
      ),
    };
  });
}
