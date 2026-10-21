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
  /** Homepage Work section heading (eyebrow stays “Work”) */
  workSectionTitle: string;
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
  workSectionTitle: "Selected work",
  now: {
    label: "Now",
    title: "Building Doomsy",
    body: "An AI film studio on your phone — one idea in, a finished film out, cut in a real editor.",
    linkUrl: "https://doomsy.ai",
    linkLabel: "doomsy.ai",
  },
};

export const defaultAboutContent: AboutContentData = {
  paragraphs: [
    "Art director and product designer in Los Angeles. Twenty years across broadcast, advertising, web, and product. I built a hand-drawn apparel brand to $3.8M and the fulfillment software behind it.",
    "I take work from the first idea to the shipped thing — brand, product, and AI creative. Right now that's Doomsy, an iOS app for directing short films.",
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
