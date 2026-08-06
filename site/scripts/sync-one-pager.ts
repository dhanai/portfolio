/**
 * Sync one-pager defaults into Neon CMS:
 * - site / about / resume content blocks
 * - upsert Doomsy work item (Studio assumed already live)
 *
 * Usage: DATABASE_URL=... npx tsx scripts/sync-one-pager.ts
 */
import { prisma } from "@/lib/prisma";
import {
  defaultAboutContent,
  defaultResumeContent,
  defaultSiteContent,
} from "@/lib/defaults/seed-data";
import { accentColors } from "@/lib/site-config";
import { projects } from "@/lib/projects";

async function upsertBlock(key: string, data: unknown) {
  await prisma.contentBlock.upsert({
    where: { key },
    create: { key, data: JSON.stringify(data) },
    update: { data: JSON.stringify(data) },
  });
  console.log(`Upserted content block: ${key}`);
}

async function upsertDoomsy() {
  const project = projects.find((p) => p.slug === "doomsy");
  if (!project) throw new Error("Missing doomsy in projects.ts");

  const existing = await prisma.work.findUnique({ where: { slug: "doomsy" } });
  const maxSort = await prisma.work.aggregate({ _max: { sortOrder: true } });
  const sortOrder = existing?.sortOrder ?? (maxSort._max.sortOrder ?? 0) + 1;

  await prisma.work.upsert({
    where: { slug: "doomsy" },
    create: {
      slug: "doomsy",
      sortOrder,
      published: true,
      title: project.title,
      subtitle: project.subtitle,
      tags: JSON.stringify(project.tags),
      year: project.year ?? "",
      color: project.color || accentColors.doomsy,
      href: project.href ?? "https://doomsy.ai",
      image: project.image ?? null,
      cardAction: "external",
      lightboxImage: null,
      role: "Founder · Creative",
      externalUrl: "https://doomsy.ai",
      diagram: null,
      reflection: "",
      sections: "[]",
    },
    update: {
      published: true,
      title: project.title,
      subtitle: project.subtitle,
      tags: JSON.stringify(project.tags),
      year: project.year ?? "",
      color: project.color || accentColors.doomsy,
      href: project.href ?? "https://doomsy.ai",
      cardAction: "external",
      externalUrl: "https://doomsy.ai",
    },
  });
  console.log("Upserted work: doomsy");
}

async function bumpHomepageCount() {
  const block = await prisma.contentBlock.findUnique({ where: { key: "site" } });
  if (!block) return;
  try {
    const data = JSON.parse(block.data) as Record<string, unknown>;
    // After upsertBlock("site") this already includes homepageWorkCount: 6.
    // Keep as a no-op safety if site block was written first.
    if (typeof data.homepageWorkCount === "number" && data.homepageWorkCount >= 6) {
      return;
    }
  } catch {
    /* ignore */
  }
}

async function main() {
  await upsertBlock("site", defaultSiteContent);
  await upsertBlock("about", defaultAboutContent);
  await upsertBlock("resume", defaultResumeContent);
  await upsertDoomsy();
  await bumpHomepageCount();
  console.log("One-pager CMS sync complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
