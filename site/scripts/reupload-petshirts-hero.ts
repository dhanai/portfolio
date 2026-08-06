/**
 * Re-upload Petshirts landing hero after a clean capture.
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import { getBlobPutAuthOptions, hasBlobStorage } from "@/lib/admin/blob-credentials";

const SRC = "/Applications/MAMP/htdocs/dev/portfolio/assets/petshirts";

async function up(local: string, blobKeyBase: string, preset: "preview" | "lightbox") {
  const input = await readFile(local);
  const { buffer, mime, ext } = await compressImageBuffer(input, "image/png", preset);
  const key = `${blobKeyBase}.${ext}`;
  const blob = await put(key, buffer, {
    access: "public",
    contentType: mime,
    addRandomSuffix: false,
    allowOverwrite: true,
    ...getBlobPutAuthOptions(),
  });
  console.log(blob.url);
  return { buffer, ext, url: blob.url };
}

async function main() {
  if (!hasBlobStorage()) throw new Error("Missing blob credentials");

  await mkdir(path.join(process.cwd(), "public/assets/work/petshirts"), {
    recursive: true,
  });

  const hero = await up(`${SRC}/landing.png`, "work/petshirts-hero", "lightbox");
  await writeFile(
    path.join(process.cwd(), `public/assets/work/petshirts-hero.${hero.ext}`),
    hero.buffer,
  );

  const mobile = await up(
    `${SRC}/landing-mobile.png`,
    "work/petshirts/landing-mobile",
    "preview",
  );
  await writeFile(
    path.join(process.cwd(), `public/assets/work/petshirts/landing-mobile.${mobile.ext}`),
    mobile.buffer,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
