/**
 * Set the Petshirts work card to a 5:4 landing-page cover, matching the other web covers.
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import { getBlobPutAuthOptions, hasBlobStorage } from "@/lib/admin/blob-credentials";

const SRC = "/Applications/MAMP/htdocs/dev/portfolio/assets/petshirts/cover-5x4.png";

async function main() {
  if (!hasBlobStorage()) throw new Error("Missing blob credentials");

  const input = await readFile(SRC);
  const { buffer, mime, ext } = await compressImageBuffer(input, "image/png", "preview");

  const localDir = path.join(process.cwd(), "public/assets/work");
  await mkdir(localDir, { recursive: true });
  await writeFile(path.join(localDir, `petshirts-cover.${ext}`), buffer);

  const blob = await put(`work/petshirts-cover.${ext}`, buffer, {
    access: "public",
    contentType: mime,
    addRandomSuffix: false,
    allowOverwrite: true,
    ...getBlobPutAuthOptions(),
  });
  console.log(`Uploaded ${blob.url}`);

  await prisma.work.update({
    where: { slug: "petshirts" },
    data: { image: blob.url },
  });
  console.log("Updated work.petshirts.image");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
