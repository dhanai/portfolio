/**
 * Upload key-flow and states boards for Doomsy, Parfade, and Petshirts.
 */
import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import {
  getBlobPutAuthOptions,
  hasBlobStorage,
} from "@/lib/admin/blob-credentials";

const EXP = "/Applications/MAMP/htdocs/dev/portfolio/assets/product-boards";

const SLUGS = ["doomsy", "parfade", "petshirts"] as const;
const BOARDS = ["flow", "states"] as const;

async function main() {
  if (!hasBlobStorage()) throw new Error("Missing blob credentials");

  const publicRoot = path.join(process.cwd(), "public/assets/work");

  for (const slug of SLUGS) {
    for (const board of BOARDS) {
      const input = await readFile(path.join(EXP, `${slug}-${board}-2x.png`));
      const { buffer, mime, ext } = await compressImageBuffer(
        input,
        "image/png",
        "lightbox",
      );

      const publicName = `${slug}/${board}-board`;
      const localOut = path.join(publicRoot, `${publicName}.${ext}`);
      await mkdir(path.dirname(localOut), { recursive: true });
      await writeFile(localOut, buffer);

      const blob = await put(`work/${publicName}.${ext}`, buffer, {
        access: "public",
        contentType: mime,
        addRandomSuffix: false,
        allowOverwrite: true,
        ...getBlobPutAuthOptions(),
      });
      console.log(`${blob.url} (${Math.round(buffer.length / 1024)} KB)`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
