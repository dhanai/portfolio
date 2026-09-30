/**
 * Add "Key flow" and "States & edge cases" sections to the Doomsy, Parfade,
 * and Petshirts rows, right after their product design section. Other
 * sections (including admin edits) are left as they are.
 */
import { prisma } from "@/lib/prisma";
import { caseStudies, type CaseStudySection } from "@/lib/case-studies";

const SLUGS = ["doomsy", "parfade", "petshirts"];
const NEW_HEADINGS = ["Key flow", "States & edge cases"];
const ANCHORS = ["Product design", "Product decisions"];

async function main() {
  for (const slug of SLUGS) {
    const study = caseStudies.find((c) => c.slug === slug);
    const work = await prisma.work.findUnique({ where: { slug } });
    if (!study || !work) {
      console.warn(`skip ${slug}: missing static study or db row`);
      continue;
    }

    const additions = NEW_HEADINGS.map((h) =>
      study.sections.find((s) => s.heading === h),
    ).filter((s): s is CaseStudySection => Boolean(s));

    const current = JSON.parse(work.sections) as CaseStudySection[];
    const kept = current.filter((s) => !NEW_HEADINGS.includes(s.heading));
    const anchor = kept.findIndex((s) => ANCHORS.includes(s.heading));
    const at = anchor === -1 ? kept.length : anchor + 1;
    const next = [...kept.slice(0, at), ...additions, ...kept.slice(at)];

    await prisma.work.update({
      where: { slug },
      data: { sections: JSON.stringify(next) },
    });
    console.log(`${slug}: ${next.map((s) => s.heading).join(" / ")}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
