import { prisma } from "@/lib/prisma";
import { caseStudies } from "@/lib/case-studies";

async function main() {
  const study = caseStudies.find((c) => c.slug === "doomsy");
  const takeout = caseStudies.find((c) => c.slug === "takeout-order");
  if (!study || !takeout) throw new Error("missing case studies");

  await prisma.work.update({
    where: { slug: "doomsy" },
    data: {
      cardAction: "caseStudy",
      href: null,
      externalUrl: "https://doomsy.ai",
      role: study.role,
      reflection: study.reflection,
      sections: JSON.stringify(study.sections),
      subtitle: study.subtitle,
      tags: JSON.stringify(study.tags),
    },
  });

  await prisma.work.update({
    where: { slug: "takeout-order" },
    data: {
      cardAction: "caseStudy",
      role: takeout.role,
      reflection: takeout.reflection,
      sections: JSON.stringify(takeout.sections),
      subtitle: takeout.subtitle,
      tags: JSON.stringify(["Brand", "Product", "Growth"]),
    },
  });

  console.log("doomsy + takeout case studies live");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
