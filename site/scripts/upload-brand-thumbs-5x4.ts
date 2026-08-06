/**
 * Upload 4:5 brand homepage thumbs for Takeout + Well Shucks.
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import { getBlobPutAuthOptions, hasBlobStorage } from "@/lib/admin/blob-credentials";

const SRC = "/Applications/MAMP/htdocs/dev/portfolio/assets/brand-thumbs";

const ITEMS = [
  { slug: "takeout-order", file: "takeout-order-5x4.png" },
  { slug: "well-shucks", file: "well-shucks-5x4.png" },
] as const;

async function main() {
  if (!hasBlobStorage()) throw new Error("Missing blob credentials");
  await mkdir(path.join(process.cwd(), "public/assets/work"), { recursive: true });

  for (const item of ITEMS) {
    const input = await readFile(path.join(SRC, item.file));
    const { buffer, mime, ext } = await compressImageBuffer(input, "image/png");
    await writeFile(
      path.join(process.cwd(), `public/assets/work/${item.slug}.${ext}`),
      buffer,
    );
    const blob = await put(`work/${item.slug}.${ext}`, buffer, {
      access: "public",
      contentType: mime,
      addRandomSuffix: false,
      allowOverwrite: true,
      ...getBlobPutAuthOptions(),
    });
    await prisma.work.update({
      where: { slug: item.slug },
      data: { image: blob.url },
    });
    console.log(`${item.slug} → ${blob.url}`);
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
