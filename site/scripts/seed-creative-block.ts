/**
 * Ensures the creative showcase content block exists in CMS.
 * Usage: npx tsx scripts/seed-creative-block.ts
 */
import { defaultCreativeShowcase } from "../lib/defaults/creative-showcase";
import { prisma } from "../lib/prisma";

async function main() {
  const exists = await prisma.contentBlock.findUnique({ where: { key: "creative" } });
  if (exists) {
    console.log("Creative block already exists");
    return;
  }
  await prisma.contentBlock.create({
    data: { key: "creative", data: JSON.stringify(defaultCreativeShowcase) },
  });
  console.log("Seeded creative showcase block");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
