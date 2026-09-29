/**
 * Upload Arden, Trestle, Wedge, and Vesper spec landing covers, layouts, and stills.
 */
import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import {
  getBlobPutAuthOptions,
  hasBlobStorage,
} from "@/lib/admin/blob-credentials";

const ROOT = "/Applications/MAMP/htdocs/dev/portfolio/assets/spec-landings";
const EXP = path.join(ROOT, "exports");

const STILLS: Record<string, [string, string][]> = {
  arden: [
    ["arden-hero.jpg", "still-visit"],
    ["arden-lab.jpg", "still-labs"],
  ],
  trestle: [
    ["trestle-aerial.jpg", "still-highway"],
    ["trestle-trailer.jpg", "still-reefer"],
  ],
  wedge: [
    ["wedge-crew.jpg", "still-crew"],
    ["wedge-card.jpg", "still-card"],
  ],
  vesper: [
    ["vesper-skin.jpg", "still-skin"],
    ["vesper-room.jpg", "still-studio"],
  ],
};

type Item = {
  local: string;
  blobKey: string;
  publicName: string;
  mode: "preview" | "fullpage";
};

const ITEMS: Item[] = Object.entries(STILLS).flatMap(([slug, stills]) => [
  {
    local: path.join(EXP, `${slug}-5x4.png`),
    blobKey: `work/${slug}.webp`,
    publicName: slug,
    mode: "preview",
  },
  {
    local: path.join(EXP, `${slug}-desktop-2x.png`),
    blobKey: `work/spec/${slug}/desktop-layout.webp`,
    publicName: `spec/${slug}/desktop-layout`,
    mode: "fullpage",
  },
  {
    local: path.join(EXP, `${slug}-mobile-2x.png`),
    blobKey: `work/spec/${slug}/mobile-layout.webp`,
    publicName: `spec/${slug}/mobile-layout`,
    mode: "fullpage",
  },
  ...stills.map(([file, name]) => ({
    local: path.join(ROOT, file),
    blobKey: `work/spec/${slug}/${name}.webp`,
    publicName: `spec/${slug}/${name}`,
    mode: "fullpage" as const,
  })),
]);

async function main() {
  if (!hasBlobStorage()) throw new Error("Missing blob credentials");

  const publicRoot = path.join(process.cwd(), "public/assets/work");

  for (const item of ITEMS) {
    const input = await readFile(item.local);
    const { buffer, mime, ext } = await compressImageBuffer(
      input,
      item.local.endsWith(".png") ? "image/png" : "image/jpeg",
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
    console.log(`${item.blobKey} → ${blob.url}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
