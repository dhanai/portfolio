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
    title: "Designer, Director,",
    titleMuted: "Degenerate",
  },
  now: {
    label: "Now",
    title: "Building Margenie",
    body: "Agent-native brand operations for Shopify merchants — human-in-the-loop approvals, Ops design system, Meta diagnostics.",
    linkUrl: siteConfig.links.margenie,
    linkLabel: "margenie.co",
  },
};

export const defaultAboutContent: AboutContentData = {
  paragraphs: [
    "Los Angeles–based design engineer and founder. 20+ years in design, UI/UX, and front-end — from agency creative direction at DJcity and Ciplex to founding Takeout Order, where I hand-drew every design and grew the brand to $3.8M in gross sales since 2020.",
    "When fulfillment broke at scale, I built a B2B printer portal on AngularJS and Firebase — real operators, every day. Now I'm building Margenie in Next.js: agent workflows, human approvals, Ops design system. I also shipped Parfade, a golf app for rounds and side games.",
    "I use AI to move faster on implementation. Architecture, craft, and production decisions are mine.",
  ],
  skills: [
    { area: "Next.js / React", level: "Expert", accent: "#BF5AF2" },
    { area: "Design systems", level: "Expert", accent: "#BF5AF2" },
    { area: "Agent / AI tooling", level: "Expert", accent: "#BF5AF2" },
    { area: "Brand / visual craft", level: "Expert", accent: "#FF453A" },
    { area: "B2B internal tools", level: "Expert", accent: "#0A84FF" },
    { area: "Integrations", level: "Expert", accent: "#0A84FF" },
    { area: "Mobile / interaction", level: "Strong", accent: "#30D158" },
  ],
  ctaTitle: "Open to opportunities",
  ctaBody:
    "Design engineering roles where craft, tooling, and production systems matter. Based in LA, open to SF hybrid.",
};

export const defaultResumeContent = resumeData;

export function buildDefaultWorks() {
  return projects.map((project, index) => {
    const study = caseStudies.find((c) => c.slug === project.slug);
    if (!study) {
      throw new Error(`Missing case study for project slug: ${project.slug}`);
    }
    return {
      slug: project.slug,
      sortOrder: index,
      published: true,
      title: project.title,
      subtitle: project.subtitle,
      tags: JSON.stringify(project.tags),
      year: project.year,
      color: project.color,
      href: project.href ?? null,
      image: project.image ?? null,
      role: study.role,
      externalUrl: study.externalUrl ?? null,
      diagram: study.diagram ?? null,
      reflection: study.reflection,
      sections: JSON.stringify(study.sections satisfies CaseStudySection[]),
    };
  });
}
