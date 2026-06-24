import type { CaseStudy, CaseStudySection } from "@/lib/case-studies";
import { getCaseStudyDiagram } from "@/lib/case-studies";
import type { Project } from "@/lib/projects";
import {
  defaultAboutContent,
  defaultResumeContent,
  defaultSiteContent,
  type AboutContentData,
  type SiteContentData,
} from "@/lib/defaults/seed-data";
import {
  defaultCreativeShowcase,
  type CreativeShowcaseData,
  type CreativeShowcaseItem,
} from "@/lib/defaults/creative-showcase";
import type { resumeData as ResumeDataType } from "@/lib/resume-data";
import { prisma } from "@/lib/prisma";

export type { SiteContentData, AboutContentData, CreativeShowcaseData };
export type ResumeContentData = typeof ResumeDataType;

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function getSiteContent(): Promise<SiteContentData> {
  const block = await prisma.contentBlock.findUnique({ where: { key: "site" } });
  if (!block) return defaultSiteContent;
  const parsed = parseJson(block.data, defaultSiteContent);
  return {
    ...parsed,
    links: { ...defaultSiteContent.links, ...parsed.links },
  };
}

export async function getAboutContent(): Promise<AboutContentData> {
  const block = await prisma.contentBlock.findUnique({ where: { key: "about" } });
  if (!block) return defaultAboutContent;
  return parseJson(block.data, defaultAboutContent);
}

export async function getResumeContent(): Promise<ResumeContentData> {
  const block = await prisma.contentBlock.findUnique({ where: { key: "resume" } });
  if (!block) return defaultResumeContent;
  return parseJson(block.data, defaultResumeContent);
}

export async function getCreativeShowcase(): Promise<CreativeShowcaseData> {
  const block = await prisma.contentBlock.findUnique({
    where: { key: "creative" },
  });
  if (!block) return defaultCreativeShowcase;
  const parsed = parseJson(block.data, defaultCreativeShowcase);
  const items = Array.isArray(parsed.items)
    ? parsed.items.map((item) =>
        normalizeCreativeItem(item as Record<string, unknown>),
      )
    : [];
  return {
    ...defaultCreativeShowcase,
    ...parsed,
    items,
  };
}

function normalizeCreativeItem(raw: Record<string, unknown>): CreativeShowcaseItem {
  const title =
    String(raw.title ?? raw.caption ?? "").trim() ||
    String(raw.alt ?? "Creative work");
  const direction = String(raw.direction ?? "").trim() || undefined;
  return {
    id: String(raw.id ?? `creative-${Math.random().toString(36).slice(2, 9)}`),
    type: raw.type === "video" ? "video" : "image",
    src: String(raw.src ?? ""),
    poster: raw.poster ? String(raw.poster) : undefined,
    title,
    direction,
    alt: String(raw.alt ?? title),
    caption: raw.caption ? String(raw.caption) : undefined,
  };
}

export async function getProjects(): Promise<Project[]> {
  const works = await prisma.work.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  if (works.length === 0) {
    const { projects } = await import("@/lib/projects");
    return projects;
  }
  return works.map((w) => ({
    slug: w.slug,
    title: w.title,
    subtitle: w.subtitle,
    tags: parseJson<string[]>(w.tags, []),
    year: w.year,
    color: w.color,
    href: w.href ?? undefined,
    image: w.image ?? undefined,
  }));
}

export async function getAllProjectsAdmin() {
  return prisma.work.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const works = await prisma.work.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  if (works.length === 0) {
    const { caseStudies } = await import("@/lib/case-studies");
    return caseStudies;
  }
  return works.map(workToCaseStudy);
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | undefined> {
  const work = await prisma.work.findUnique({ where: { slug } });
  if (!work || !work.published) {
    const { caseStudies } = await import("@/lib/case-studies");
    return caseStudies.find((c) => c.slug === slug);
  }
  return workToCaseStudy(work);
}

export async function getWorkById(id: string) {
  return prisma.work.findUnique({ where: { id } });
}

function resolveDiagram(slug: string, diagram: string | null): string | undefined {
  const staticDiagram = getCaseStudyDiagram(slug);
  const trimmed = diagram?.trim();

  if (trimmed?.startsWith("http://") || trimmed?.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed?.endsWith(".svg")) {
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }

  return staticDiagram;
}

function workToCaseStudy(work: {
  slug: string;
  title: string;
  subtitle: string;
  tags: string;
  year: string;
  role: string;
  externalUrl: string | null;
  diagram: string | null;
  reflection: string;
  sections: string;
}): CaseStudy {
  return {
    slug: work.slug,
    title: work.title,
    subtitle: work.subtitle,
    tags: parseJson<string[]>(work.tags, []),
    year: work.year,
    role: work.role,
    externalUrl: work.externalUrl ?? undefined,
    diagram: resolveDiagram(work.slug, work.diagram),
    sections: parseJson<CaseStudySection[]>(work.sections, []),
    reflection: work.reflection,
  };
}

/** Site config shape used across layout/metadata */
export async function getSiteConfigFromCms() {
  const site = await getSiteContent();
  return {
    name: site.name,
    fullName: site.fullName,
    title: site.title,
    description: site.description,
    url: site.url,
    oneLiner: site.oneLiner,
    links: site.links,
    nav: [
      { href: "/about", label: "About" },
      { href: "/resume", label: "Resume" },
    ],
  } as const;
}
