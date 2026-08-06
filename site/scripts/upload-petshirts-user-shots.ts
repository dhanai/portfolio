/**
 * Upload user-provided Petshirts mobile screenshots into case-study gallery.
 */
import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import { getBlobPutAuthOptions, hasBlobStorage } from "@/lib/admin/blob-credentials";

const SRC =
  "/Users/dhanai/.cursor/projects/Applications-MAMP-htdocs-dev-portfolio/assets";

const FILES = [
  ["landing-mobile", "ps-landing-75ef1cef-8b0a-43e6-a3a2-c0f812cd056e.png"],
  ["styles", "ps-pet-styles-463f22d7-f617-459a-b8d7-9a858ab7dd2e.png"],
  ["upload", "ps-pet-uploader-d5673db7-8e62-4f41-b737-dd8a5ca43b06.png"],
  ["preview-howling", "ps-style-detail-1-ae994d3e-eb2b-4c4c-9969-a894ea4fbb85.png"],
  ["preview-rap", "ps-style-detail-2-2b797658-f0fc-4425-9f51-bc9bf19f3973.png"],
  ["cart", "ps-cart-851484bf-fe96-4b9a-a926-57b6b3d61554.png"],
] as const;

async function main() {
  if (!hasBlobStorage()) throw new Error("Missing blob credentials");

  const localDir = path.join(process.cwd(), "public/assets/work/petshirts");
  await mkdir(localDir, { recursive: true });
  const out: Record<string, string> = {};

  for (const [slug, file] of FILES) {
    const input = await readFile(path.join(SRC, file));
    const { buffer, mime, ext } = await compressImageBuffer(input, "image/png");
    await writeFile(path.join(localDir, `${slug}.${ext}`), buffer);
    const blob = await put(`work/petshirts/${slug}.${ext}`, buffer, {
      access: "public",
      contentType: mime,
      addRandomSuffix: false,
      allowOverwrite: true,
      ...getBlobPutAuthOptions(),
    });
    out[slug] = blob.url;
    console.log(`${slug} → ${blob.url}`);
  }

  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
