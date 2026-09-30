/**
 * Upload the angled-masonry card thumbnails for Doomsy, Parfade and Petshirts
 * and point their work rows at them.
 */
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import {
  getBlobPutAuthOptions,
  hasBlobStorage,
} from "@/lib/admin/blob-credentials";
import { prisma } from "@/lib/prisma";

const ROOT = "/Applications/MAMP/htdocs/dev/portfolio/assets/product-thumbs";
const SLUGS = ["doomsy", "parfade", "petshirts"] as const;

async function main() {
  if (!hasBlobStorage()) throw new Error("Missing blob credentials");
  const publicRoot = path.join(process.cwd(), "public/assets/work");

  for (const slug of SLUGS) {
    const input = await readFile(path.join(ROOT, `${slug}-5x4.png`));
    const { buffer, mime, ext } = await compressImageBuffer(
      input,
      "image/png",
      "preview",
    );
    const name = `${slug}-thumb-v2.${ext}`;
    await writeFile(path.join(publicRoot, name), buffer);

    const blob = await put(`work/${name}`, buffer, {
      access: "public",
      contentType: mime,
      addRandomSuffix: false,
      allowOverwrite: true,
      ...getBlobPutAuthOptions(),
    });
    await prisma.work.update({ where: { slug }, data: { image: blob.url } });
    console.log(`${slug} → ${blob.url} (${Math.round(buffer.length / 1024)} KB)`);
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
