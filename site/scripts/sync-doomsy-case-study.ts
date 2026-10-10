import { prisma } from "@/lib/prisma";
import { caseStudies } from "@/lib/case-studies";
import { projects } from "@/lib/projects";
import { defaultSiteContent } from "@/lib/defaults/seed-data";
import { resumeData } from "@/lib/resume-data";

async function main() {
  const study = caseStudies.find((c) => c.slug === "doomsy");
  const project = projects.find((p) => p.slug === "doomsy");
  if (!study || !project) throw new Error("missing doomsy");

  await prisma.work.update({
    where: { slug: "doomsy" },
    data: {
      subtitle: study.subtitle,
      role: study.role,
      year: study.year,
      image: project.image,
      reflection: study.reflection,
      sections: JSON.stringify(study.sections),
      tags: JSON.stringify(study.tags),
      cardAction: "caseStudy",
      externalUrl: "https://doomsy.ai",
    },
  });

  const site = await prisma.contentBlock.findUnique({ where: { key: "site" } });
  if (site) {
    const data = JSON.parse(site.data);
    if (data.now?.title === "Building Doomsy") {
      data.now.body = defaultSiteContent.now.body;
      await prisma.contentBlock.update({
        where: { key: "site" },
        data: { data: JSON.stringify(data) },
      });
    }
  }

  const resume = await prisma.contentBlock.findUnique({ where: { key: "resume" } });
  if (resume) {
    const data = JSON.parse(resume.data);
    const doomsy = resumeData.experience.find((e) => e.company === "Doomsy");
    const row = data.experience?.find((e: { company: string }) => e.company === "Doomsy");
    if (doomsy && row) {
      row.bullets = doomsy.bullets;
      await prisma.contentBlock.update({
        where: { key: "resume" },
        data: { data: JSON.stringify(data) },
      });
    }
  }

  console.log("doomsy case study synced");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
