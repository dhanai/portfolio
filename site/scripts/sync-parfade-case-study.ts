import { prisma } from "@/lib/prisma";
import { caseStudies } from "@/lib/case-studies";

async function main() {
  const study = caseStudies.find((c) => c.slug === "parfade");
  if (!study) throw new Error("missing parfade");

  await prisma.work.update({
    where: { slug: "parfade" },
    data: {
      subtitle: study.subtitle,
      role: study.role,
      reflection: study.reflection,
      sections: JSON.stringify(study.sections),
      tags: JSON.stringify(study.tags),
      cardAction: "caseStudy",
      href: null,
      externalUrl: "https://www.parfade.com",
    },
  });

  console.log("parfade case study sections synced");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
