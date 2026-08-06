/**
 * Compress Doomsy landing screenshot and set as work preview.
 * Usage: npx tsx scripts/set-doomsy-thumb.ts [path-to-png]
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import { getBlobPutAuthOptions, hasBlobStorage } from "@/lib/admin/blob-credentials";

async function main() {
  const inputPath =
    process.argv[2] ||
    "/var/folders/vc/zyksplk56z5f6pkm4f3fmk140000gn/T/cursor/screenshots/doomsy-landing.png";

  const input = await readFile(inputPath);
  const meta = await sharp(input).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (!width || !height) throw new Error("Could not read screenshot dimensions");

  // Card uses aspect-[5/4] — crop top-weighted for hero
  const targetRatio = 5 / 4;
  let cropW = width;
  let cropH = Math.round(width / targetRatio);
  if (cropH > height) {
    cropH = height;
    cropW = Math.round(height * targetRatio);
  }
  const left = Math.max(0, Math.round((width - cropW) / 2));
  const top = 0;

  const cropped = await sharp(input)
    .extract({ left, top, width: cropW, height: cropH })
    .png()
    .toBuffer();

  const { buffer, mime, ext } = await compressImageBuffer(cropped, "image/png");

  const localDir = path.join(process.cwd(), "public/assets/work");
  await mkdir(localDir, { recursive: true });
  const localPath = path.join(localDir, `doomsy.${ext}`);
  await writeFile(localPath, buffer);
  console.log(`Wrote local ${localPath} (${buffer.length} bytes)`);

  let imageUrl = `/assets/work/doomsy.${ext}`;
  if (hasBlobStorage()) {
    const blob = await put(`work/doomsy.${ext}`, buffer, {
      access: "public",
      contentType: mime,
      addRandomSuffix: false,
      allowOverwrite: true,
      ...getBlobPutAuthOptions(),
    });
    imageUrl = blob.url;
    console.log(`Uploaded blob ${imageUrl}`);
  } else {
    console.log("No blob token — using local public path");
  }

  await prisma.work.update({
    where: { slug: "doomsy" },
    data: { image: imageUrl },
  });
  console.log("Updated CMS work.doomsy.image");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
