/**
 * Upload Doomsy film-app case-study images (hero, card thumb, app screens) to Blob.
 * Usage: npx tsx scripts/upload-doomsy-film.ts [source-dir]
 */
import { readFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { compressImageBuffer, type CompressPreset } from "@/lib/admin/compress-image";
import { getBlobPutAuthOptions, hasBlobStorage } from "@/lib/admin/blob-credentials";

const SRC_DIR = process.argv[2] || "/tmp/doomsy/portfolio";

const FILES: { slug: string; preset: CompressPreset }[] = [
  { slug: "hero", preset: "lightbox" },
  { slug: "thumb", preset: "preview" },
  { slug: "editor", preset: "preview" },
  { slug: "project", preset: "preview" },
  { slug: "shots", preset: "preview" },
  { slug: "take", preset: "preview" },
  { slug: "cast", preset: "preview" },
  { slug: "audio", preset: "preview" },
];

async function main() {
  if (!hasBlobStorage()) throw new Error("Missing blob credentials");

  const out: Record<string, string> = {};
  for (const { slug, preset } of FILES) {
    const input = await readFile(path.join(SRC_DIR, `${slug}.png`));
    const { buffer, mime, ext } = await compressImageBuffer(input, "image/png", preset);
    const blob = await put(`work/doomsy/film/${slug}.${ext}`, buffer, {
      access: "public",
      contentType: mime,
      addRandomSuffix: false,
      allowOverwrite: true,
      ...getBlobPutAuthOptions(),
    });
    out[slug] = blob.url;
    console.log(`${slug} → ${blob.url} (${buffer.length} bytes)`);
  }

  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
