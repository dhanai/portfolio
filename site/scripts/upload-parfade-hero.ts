/**
 * Upload full-page Parfade marketing screenshot as case-study hero.
 */
import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import { getBlobPutAuthOptions, hasBlobStorage } from "@/lib/admin/blob-credentials";

const SRC =
  process.argv[2] ||
  "/Applications/MAMP/htdocs/dev/portfolio/assets/screencapture-parfade-2026-06-23-07_26_15.png";

async function main() {
  if (!hasBlobStorage()) throw new Error("Missing blob credentials");

  const input = await readFile(SRC);
  const { buffer, mime, ext } = await compressImageBuffer(input, "image/png");

  const localDir = path.join(process.cwd(), "public/assets/work");
  await mkdir(localDir, { recursive: true });
  await writeFile(path.join(localDir, `parfade-hero.${ext}`), buffer);

  const blob = await put(`work/parfade-hero.${ext}`, buffer, {
    access: "public",
    contentType: mime,
    addRandomSuffix: false,
    allowOverwrite: true,
    ...getBlobPutAuthOptions(),
  });

  console.log(blob.url);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
