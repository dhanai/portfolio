import { prisma } from "@/lib/prisma";
import { caseStudies } from "@/lib/case-studies";

async function main() {
  const study = caseStudies.find((c) => c.slug === "studio");
  if (!study) throw new Error("missing studio case study");

  await prisma.work.update({
    where: { slug: "studio" },
    data: {
      title: study.title,
      subtitle: study.subtitle,
      tags: JSON.stringify(study.tags),
      year: study.year ?? "2026",
      role: study.role,
      reflection: study.reflection,
      sections: JSON.stringify(study.sections),
      cardAction: "caseStudy",
      href: null,
      // Keep the uploaded thumbs
      image:
        "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/studio.webp",
      lightboxImage:
        "https://xafmoppw6xwvpa6r.public.blob.vercel-storage.com/work/studio-lightbox.webp",
    },
  });

  console.log("Studio case study published — card opens /work/studio");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
