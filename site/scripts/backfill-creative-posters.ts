/**
 * Extract a poster frame for every creative video that doesn't have one,
 * upload it to Blob, and save it on the item.
 *
 *   npx tsx --env-file=.env scripts/backfill-creative-posters.ts [--dry]
 */
import { execFileSync } from "child_process";
import { mkdtemp, readFile, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { put } from "@vercel/blob";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import { getBlobPutAuthOptions } from "@/lib/admin/blob-credentials";
import { prisma } from "@/lib/prisma";

const POSTER_AT_SECONDS = 1;
const dry = process.argv.includes("--dry");

async function main() {
  const block = await prisma.contentBlock.findUnique({ where: { key: "creative" } });
  if (!block) throw new Error("No creative block");
  const data = JSON.parse(block.data) as {
    items: { id: string; type: string; src: string; poster?: string }[];
  };
  const dir = await mkdtemp(path.join(tmpdir(), "posters-"));

  for (const item of data.items) {
    if (item.type !== "video" || item.poster) continue;

    const video = path.join(dir, `${item.id}.mp4`);
    const frame = path.join(dir, `${item.id}.jpg`);
    const res = await fetch(item.src);
    if (!res.ok) throw new Error(`${item.id}: ${res.status} fetching video`);
    await writeFile(video, Buffer.from(await res.arrayBuffer()));
    execFileSync("ffmpeg", [
      "-y", "-loglevel", "error",
      "-ss", String(POSTER_AT_SECONDS), "-i", video,
      "-frames:v", "1", "-q:v", "2", frame,
    ]);

    if (dry) {
      console.log(`${item.id} → ${frame}`);
      continue;
    }

    const { buffer, mime, ext } = await compressImageBuffer(
      await readFile(frame),
      "image/jpeg",
      "preview",
    );
    const blob = await put(`creative/${item.id}-poster.${ext}`, buffer, {
      access: "public",
      contentType: mime,
      addRandomSuffix: false,
      allowOverwrite: true,
      ...getBlobPutAuthOptions(),
    });
    item.poster = blob.url;
    console.log(`${item.id} → ${blob.url}`);
  }

  if (!dry) {
    await prisma.contentBlock.update({
      where: { key: "creative" },
      data: { data: JSON.stringify(data) },
    });
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
