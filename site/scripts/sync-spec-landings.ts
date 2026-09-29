import { prisma } from "@/lib/prisma";
import { caseStudies } from "@/lib/case-studies";
import { accentColors } from "@/lib/site-config";

const BLOB = "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work";

const SLUGS = ["arden", "trestle", "wedge", "vesper"] as const;

async function main() {
  for (const slug of SLUGS) {
    const study = caseStudies.find((c) => c.slug === slug);
    if (!study) throw new Error(`missing ${slug}`);

    const data = {
      title: study.title,
      subtitle: study.subtitle,
      tags: JSON.stringify(study.tags),
      year: study.year ?? "2026",
      color: accentColors[slug],
      role: study.role,
      reflection: study.reflection,
      sections: JSON.stringify(study.sections),
      cardAction: "caseStudy",
      href: null,
      externalUrl: study.externalUrl ?? null,
      image: `${BLOB}/${slug}.webp`,
      published: true,
    };

    const maxSort = await prisma.work.aggregate({ _max: { sortOrder: true } });
    await prisma.work.upsert({
      where: { slug },
      create: { slug, sortOrder: (maxSort._max.sortOrder ?? 0) + 1, ...data },
      update: data,
    });
    console.log(`${slug} upserted`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
