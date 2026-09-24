/**
 * Upload Undeniable card thumb, hero, gallery screens, and placement stills.
 */
import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import {
  getBlobPutAuthOptions,
  hasBlobStorage,
} from "@/lib/admin/blob-credentials";

const ROOT = "/Applications/MAMP/htdocs/dev/portfolio/assets/undeniable";
const STILLS = "/Applications/MAMP/htdocs/dev/portfolio/assets/undeniable-stills";

const ITEMS = [
  {
    local: path.join(ROOT, "undeniable-5x4.png"),
    blobKey: "work/undeniable.webp",
    publicName: "undeniable",
    mode: "preview" as const,
  },
  {
    local: path.join(ROOT, "desktop-layout-2x.png"),
    blobKey: "work/undeniable/desktop-layout.webp",
    publicName: "undeniable/desktop-layout",
    mode: "fullpage" as const,
  },
  {
    local: path.join(ROOT, "mobile-layout-2x.png"),
    blobKey: "work/undeniable/mobile-layout.webp",
    publicName: "undeniable/mobile-layout",
    mode: "fullpage" as const,
  },
  {
    local: path.join(ROOT, "desktop-hero.png"),
    blobKey: "work/undeniable/desktop-hero.webp",
    publicName: "undeniable/desktop-hero",
    mode: "fullpage" as const,
  },
  {
    local: path.join(ROOT, "mobile-hero.png"),
    blobKey: "work/undeniable/mobile-hero.webp",
    publicName: "undeniable/mobile-hero",
    mode: "fullpage" as const,
  },
  {
    local: path.join(STILLS, "porsche-car.jpg"),
    blobKey: "work/undeniable/still-porsche.webp",
    publicName: "undeniable/still-porsche",
    mode: "fullpage" as const,
  },
  {
    local: path.join(STILLS, "tower38-beauty.jpg"),
    blobKey: "work/undeniable/still-tower38.webp",
    publicName: "undeniable/still-tower38",
    mode: "fullpage" as const,
  },
  {
    local: path.join(STILLS, "skims-fashion.jpg"),
    blobKey: "work/undeniable/still-skims.webp",
    publicName: "undeniable/still-skims",
    mode: "fullpage" as const,
  },
] as const;

async function main() {
  if (!hasBlobStorage()) throw new Error("Missing blob credentials");

  const publicRoot = path.join(process.cwd(), "public/assets/work");
  await mkdir(path.join(publicRoot, "undeniable"), { recursive: true });

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
