/**
 * Sync dual AD/PD positioning into Neon CMS.
 * Usage: npx tsx scripts/sync-dual-positioning.ts
 */
import { prisma } from "@/lib/prisma";
import {
  defaultAboutContent,
  defaultResumeContent,
  defaultSiteContent,
} from "@/lib/defaults/seed-data";
import { caseStudies } from "@/lib/case-studies";
import { projects } from "@/lib/projects";

async function upsertBlock(key: string, data: unknown) {
  await prisma.contentBlock.upsert({
    where: { key },
    create: { key, data: JSON.stringify(data) },
    update: { data: JSON.stringify(data) },
  });
  console.log(`Upserted content block: ${key}`);
}

/** Ensure Brand/Product tags exist; merge with existing specialty tags */
function mergeLaneTags(existing: string[], desired: string[]): string[] {
  const lanes = desired.filter((t) => {
    const x = t.toLowerCase();
    return x === "brand" || x === "product";
  });
  const rest = existing.filter((t) => {
    const x = t.toLowerCase();
    return x !== "brand" && x !== "product";
  });
  const extras = desired.filter((t) => {
    const x = t.toLowerCase();
    return x !== "brand" && x !== "product" && !rest.some((r) => r.toLowerCase() === x);
  });
  return [...lanes, ...extras, ...rest].slice(0, 6);
}

async function syncWorkFromDefaults() {
  for (const project of projects) {
    const study = caseStudies.find((c) => c.slug === project.slug);
    const existing = await prisma.work.findUnique({ where: { slug: project.slug } });
    if (!existing) {
      console.log(`Skip missing work (create in admin): ${project.slug}`);
      continue;
    }

    const existingTags = JSON.parse(existing.tags) as string[];
    const tags = mergeLaneTags(existingTags, project.tags);

    await prisma.work.update({
      where: { slug: project.slug },
      data: {
        subtitle: project.subtitle,
        tags: JSON.stringify(tags),
        ...(study
          ? {
              role: study.role,
              reflection: study.reflection,
              sections: JSON.stringify(study.sections),
              externalUrl: study.externalUrl ?? existing.externalUrl,
            }
          : {}),
      },
    });
    console.log(`Updated work: ${project.slug} → ${tags.join(", ")}`);
  }

  // Heuristic lane tags for other published CMS works
  const all = await prisma.work.findMany();
  for (const work of all) {
    if (projects.some((p) => p.slug === work.slug)) continue;
    const tags = JSON.parse(work.tags) as string[];
    const lower = tags.map((t) => t.toLowerCase());
    if (lower.includes("brand") || lower.includes("product")) continue;

    const title = `${work.title} ${work.subtitle}`.toLowerCase();
    const next = [...tags];
    if (
      /brand|campaign|apparel|illustration|creative|motion|film|tv|title/.test(
        title,
      )
    ) {
      next.unshift("Brand");
    }
    if (
      /app|portal|ops|platform|saas|ios|product|tool|dashboard|feed/.test(title)
    ) {
      next.unshift("Product");
    }
    if (next.length === tags.length) {
      next.unshift("Brand"); // default creative portfolio pieces
    }
    await prisma.work.update({
      where: { id: work.id },
      data: { tags: JSON.stringify(next.slice(0, 6)) },
    });
    console.log(`Tagged ${work.slug}: ${next.slice(0, 6).join(", ")}`);
  }
}

async function main() {
  // Preserve homepageWorkCount if already set higher
  const existingSite = await prisma.contentBlock.findUnique({
    where: { key: "site" },
  });
  let siteData = defaultSiteContent;
  if (existingSite) {
    try {
      const parsed = JSON.parse(existingSite.data) as {
        homepageWorkCount?: number;
      };
      if (
        typeof parsed.homepageWorkCount === "number" &&
        parsed.homepageWorkCount > siteData.homepageWorkCount
      ) {
        siteData = {
          ...defaultSiteContent,
          homepageWorkCount: parsed.homepageWorkCount,
        };
      }
    } catch {
      /* use defaults */
    }
  }

  await upsertBlock("site", siteData);
  await upsertBlock("about", defaultAboutContent);
  await upsertBlock("resume", defaultResumeContent);
  await syncWorkFromDefaults();
  console.log("Dual positioning CMS sync complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
