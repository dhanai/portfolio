/**
 * Upload North of Real card thumb, layout frames, and work stills.
 */
import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import {
  getBlobPutAuthOptions,
  hasBlobStorage,
} from "@/lib/admin/blob-credentials";

const ROOT = "/Applications/MAMP/htdocs/dev/portfolio/assets/north-of-real";
const EXP = path.join(ROOT, "exports");

const ITEMS = [
  {
    local: path.join(EXP, "north-of-real-5x4.png"),
    blobKey: "work/north-of-real.webp",
    publicName: "north-of-real",
    mode: "preview" as const,
  },
  {
    local: path.join(EXP, "desktop-layout-2x.png"),
    blobKey: "work/north-of-real/desktop-layout.webp",
    publicName: "north-of-real/desktop-layout",
    mode: "fullpage" as const,
  },
  {
    local: path.join(EXP, "mobile-layout-2x.png"),
    blobKey: "work/north-of-real/mobile-layout.webp",
    publicName: "north-of-real/mobile-layout",
    mode: "fullpage" as const,
  },
  {
    local: path.join(EXP, "desktop-hero-2x.png"),
    blobKey: "work/north-of-real/desktop-hero.webp",
    publicName: "north-of-real/desktop-hero",
    mode: "fullpage" as const,
  },
  {
    local: path.join(ROOT, "crop-lost-years.jpg"),
    blobKey: "work/north-of-real/still-lost-years.webp",
    publicName: "north-of-real/still-lost-years",
    mode: "fullpage" as const,
  },
  {
    local: path.join(ROOT, "crop-superbowl.jpg"),
    blobKey: "work/north-of-real/still-superbowl.webp",
    publicName: "north-of-real/still-superbowl",
    mode: "fullpage" as const,
  },
  {
    local: path.join(ROOT, "crop-jeep.jpg"),
    blobKey: "work/north-of-real/still-jeep.webp",
    publicName: "north-of-real/still-jeep",
    mode: "fullpage" as const,
  },
  {
    local: path.join(ROOT, "crop-nike.jpg"),
    blobKey: "work/north-of-real/still-nike.webp",
    publicName: "north-of-real/still-nike",
    mode: "fullpage" as const,
  },
  {
    local: path.join(ROOT, "crop-set-shift.jpg"),
    blobKey: "work/north-of-real/still-set-shift.webp",
    publicName: "north-of-real/still-set-shift",
    mode: "fullpage" as const,
  },
] as const;

async function main() {
  if (!hasBlobStorage()) throw new Error("Missing blob credentials");

  const publicRoot = path.join(process.cwd(), "public/assets/work");
  await mkdir(path.join(publicRoot, "north-of-real"), { recursive: true });

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
