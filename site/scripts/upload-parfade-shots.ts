/**
 * Upload Parfade case-study screenshots to Blob.
 */
import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import { getBlobPutAuthOptions, hasBlobStorage } from "@/lib/admin/blob-credentials";

const SRC_DIR =
  "/Users/dhanai/.cursor/projects/Applications-MAMP-htdocs-dev-portfolio/assets";

const FILES = [
  ["landing", "landing-a5fb3ed7-d5cf-4f2d-b557-958ba90bf029.png"],
  ["discover", "discover-13fc8e35-b23b-4aa7-a434-a6b76389d8bf.png"],
  ["my-rounds", "my-rounds-59911376-e7b7-4f62-9c0a-20dea580b5da.png"],
  ["create-round", "create-round-cd1a6084-003d-4701-890c-30120ff9fab8.png"],
  ["invite", "create-round-invite-0bcaf410-88f6-413f-acb4-ea92cdefcf51.png"],
  ["games", "games-7ca0b14c-7218-4914-bf4d-43f4b3e275c5.png"],
  ["activity", "profile-2-992287df-d77e-4c2e-9963-f6a2d43394a5.png"],
  ["groups", "groups-e6583e28-04ec-4df1-8b61-658708f30d5b.png"],
  ["profile", "profile-95709aab-a884-45a9-afa4-54befc159643.png"],
] as const;

async function main() {
  if (!hasBlobStorage()) throw new Error("Missing blob credentials");

  const localDir = path.join(process.cwd(), "public/assets/work/parfade");
  await mkdir(localDir, { recursive: true });
  const out: Record<string, string> = {};

  for (const [slug, file] of FILES) {
    const input = await readFile(path.join(SRC_DIR, file));
    const { buffer, mime, ext } = await compressImageBuffer(input, "image/png");
    const filename = `${slug}.${ext}`;
    await writeFile(path.join(localDir, filename), buffer);

    const blob = await put(`work/parfade/${filename}`, buffer, {
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
