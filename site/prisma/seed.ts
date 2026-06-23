import { prisma } from "@/lib/prisma";
import {
  buildDefaultWorks,
  defaultAboutContent,
  defaultResumeContent,
  defaultSiteContent,
} from "@/lib/defaults/seed-data";

async function main() {
  const workCount = await prisma.work.count();
  if (workCount === 0) {
    const works = buildDefaultWorks();
    for (const work of works) {
      await prisma.work.create({ data: work });
    }
    console.log(`Seeded ${works.length} work items`);
  } else {
    console.log(`Skipped work seed (${workCount} existing)`);
  }

  const blocks: { key: string; data: unknown }[] = [
    { key: "site", data: defaultSiteContent },
    { key: "about", data: defaultAboutContent },
    { key: "resume", data: defaultResumeContent },
  ];

  for (const block of blocks) {
    const exists = await prisma.contentBlock.findUnique({
      where: { key: block.key },
    });
    if (!exists) {
      await prisma.contentBlock.create({
        data: { key: block.key, data: JSON.stringify(block.data) },
      });
      console.log(`Seeded content block: ${block.key}`);
    } else {
      console.log(`Skipped content block: ${block.key} (exists)`);
    }
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
