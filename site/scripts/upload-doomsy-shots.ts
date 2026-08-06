/**
 * Upload Doomsy case-study screenshots to Blob and print URL map.
 */
import { readdir, readFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import { getBlobPutAuthOptions, hasBlobStorage } from "@/lib/admin/blob-credentials";

const SRC_DIR =
  "/Users/dhanai/.cursor/projects/Applications-MAMP-htdocs-dev-portfolio/assets";

const FILES = [
  "landing-2e18d70b-cf21-40de-bd30-9b5c262c41ac.png",
  "feed-9a177e60-353e-4d6b-937c-8e1433f450bf.png",
  "feed-2-170bb154-b50f-4af7-b154-df29b91f3c1b.png",
  "story-43c0b910-bf9e-48b3-9d1f-27abddc22e15.png",
  "reel-c6e21fe2-341a-4b07-b6a2-afea8dab18d0.png",
  "feed-2-edit-54d96924-db25-4e1c-a989-4463febee42e.png",
  "agent-chat-a3c91409-a88a-4dde-826d-bf08697e8b39.png",
  "profile-settings-a6d9e837-dc9b-4a41-a1a7-d14e8a7d6565.png",
  "profile-settings-2-05b02b29-18d7-4151-9f1b-07b57cd03c94.png",
] as const;

const SLUGS = [
  "landing",
  "feed",
  "feed-post",
  "story",
  "reel",
  "edit-image",
  "agent-chat",
  "director",
  "brand-settings",
] as const;

async function main() {
  if (!hasBlobStorage()) throw new Error("Missing blob credentials");

  const out: Record<string, string> = {};
  const localDir = path.join(process.cwd(), "public/assets/work/doomsy");
  const { mkdir, writeFile } = await import("fs/promises");
  await mkdir(localDir, { recursive: true });

  for (let i = 0; i < FILES.length; i++) {
    const file = FILES[i];
    const slug = SLUGS[i];
    const input = await readFile(path.join(SRC_DIR, file));
    const { buffer, mime, ext } = await compressImageBuffer(input, "image/png");
    const filename = `${slug}.${ext}`;
    await writeFile(path.join(localDir, filename), buffer);

    const blob = await put(`work/doomsy/${filename}`, buffer, {
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
