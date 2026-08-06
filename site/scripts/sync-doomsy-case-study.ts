import { prisma } from "@/lib/prisma";
import { caseStudies } from "@/lib/case-studies";

async function main() {
  const study = caseStudies.find((c) => c.slug === "doomsy");
  if (!study) throw new Error("missing doomsy");

  await prisma.work.update({
    where: { slug: "doomsy" },
    data: {
      subtitle: study.subtitle,
      role: study.role,
      reflection: study.reflection,
      sections: JSON.stringify(study.sections),
      tags: JSON.stringify(study.tags),
      cardAction: "caseStudy",
      externalUrl: "https://doomsy.ai",
    },
  });

  console.log("doomsy case study sections synced");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
