/**
 * Upload 2026 redesigns of UAV, Sunworld, Pacific Mattress, and Strumly:
 * 5:4 covers plus full desktop and mobile layouts.
 */
import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import {
  getBlobPutAuthOptions,
  hasBlobStorage,
} from "@/lib/admin/blob-credentials";

const EXP = "/Applications/MAMP/htdocs/dev/portfolio/assets/legacy-refresh/exports";

const SLUGS = ["uav", "sunworld", "pacific-mattress", "strumly"] as const;

type Item = {
  local: string;
  blobKey: string;
  publicName: string;
  mode: "preview" | "fullpage";
};

const ITEMS: Item[] = SLUGS.flatMap((slug) => [
  {
    local: path.join(EXP, `${slug}-5x4.png`),
    blobKey: `work/${slug}-refresh.webp`,
    publicName: `${slug}-refresh`,
    mode: "preview",
  },
  {
    local: path.join(EXP, `${slug}-desktop-2x.png`),
    blobKey: `work/refresh/${slug}/desktop-layout.webp`,
    publicName: `refresh/${slug}/desktop-layout`,
    mode: "fullpage",
  },
  {
    local: path.join(EXP, `${slug}-mobile-2x.png`),
    blobKey: `work/refresh/${slug}/mobile-layout.webp`,
    publicName: `refresh/${slug}/mobile-layout`,
    mode: "fullpage",
  },
]);

async function main() {
  if (!hasBlobStorage()) throw new Error("Missing blob credentials");

  const publicRoot = path.join(process.cwd(), "public/assets/work");

  for (const item of ITEMS) {
    const input = await readFile(item.local);
    const { buffer, mime, ext } = await compressImageBuffer(
      input,
      "image/png",
      item.mode,
    );

    const localOut = path.join(publicRoot, `${item.publicName}.${ext}`);
    await mkdir(path.dirname(localOut), { recursive: true });
    await writeFile(localOut, buffer);

    const blobKey = item.blobKey.replace(/\.webp$/, `.${ext}`);
    const blob = await put(blobKey, buffer, {
      access: "public",
      contentType: mime,
      addRandomSuffix: false,
      allowOverwrite: true,
      ...getBlobPutAuthOptions(),
    });
    console.log(`${item.blobKey} → ${blob.url} (${Math.round(buffer.length / 1024)} KB)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
