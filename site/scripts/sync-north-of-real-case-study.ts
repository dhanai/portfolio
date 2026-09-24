import { prisma } from "@/lib/prisma";
import { caseStudies } from "@/lib/case-studies";
import { accentColors } from "@/lib/site-config";

const IMAGE =
  "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/north-of-real.webp";

async function main() {
  const study = caseStudies.find((c) => c.slug === "north-of-real");
  if (!study) throw new Error("missing north-of-real");

  const maxSort = await prisma.work.aggregate({ _max: { sortOrder: true } });
  const nextSort = (maxSort._max.sortOrder ?? 0) + 1;

  await prisma.work.upsert({
    where: { slug: "north-of-real" },
    create: {
      slug: "north-of-real",
      sortOrder: nextSort,
      published: true,
      title: study.title,
      subtitle: study.subtitle,
      tags: JSON.stringify(study.tags),
      year: study.year ?? "2026",
      color: accentColors.northOfReal,
      role: study.role,
      reflection: study.reflection,
      sections: JSON.stringify(study.sections),
      cardAction: "caseStudy",
      href: null,
      externalUrl: study.externalUrl ?? null,
      image: IMAGE,
    },
    update: {
      title: study.title,
      subtitle: study.subtitle,
      tags: JSON.stringify(study.tags),
      year: study.year ?? "2026",
      color: accentColors.northOfReal,
      role: study.role,
      reflection: study.reflection,
      sections: JSON.stringify(study.sections),
      cardAction: "caseStudy",
      href: null,
      externalUrl: study.externalUrl ?? null,
      image: IMAGE,
      published: true,
    },
  });

  console.log("north-of-real case study upserted");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
