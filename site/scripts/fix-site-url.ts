/**
 * One-off: update CMS site URL if still pointing at dhanai.dev
 * Usage: npx tsx scripts/fix-site-url.ts
 */
import { prisma } from "../lib/prisma";

const TARGET = "https://dhanai.net";

async function main() {
  const block = await prisma.contentBlock.findUnique({ where: { key: "site" } });
  if (!block) {
    console.log("No site content block found — seed may not have run.");
    return;
  }

  const data = JSON.parse(block.data) as { url?: string; [key: string]: unknown };
  const before = data.url;

  if (before === TARGET) {
    console.log("CMS site URL already correct:", before);
    return;
  }

  data.url = TARGET;
  await prisma.contentBlock.update({
    where: { key: "site" },
    data: { data: JSON.stringify(data) },
  });

  console.log("Updated CMS site URL:", before, "→", TARGET);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
