/**
 * Upload Petshirts case-study images (hero + gallery + card thumb).
 */
import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { put } from "@vercel/blob";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import { getBlobPutAuthOptions, hasBlobStorage } from "@/lib/admin/blob-credentials";

const SRC = "/Applications/MAMP/htdocs/dev/portfolio/assets/petshirts";

const GALLERY = [
  ["landing-mobile", "landing-mobile.png"],
  ["create-mobile", "create-mobile.png"],
  ["styles-mobile", "styles-mobile.png"],
  ["create", "create.png"],
  ["styles", "styles.png"],
  ["sample-renaissance", "sample-renaissance.jpg"],
  ["sample-anime", "sample-anime.jpg"],
  ["lifestyle-tshirt", "lifestyle-tshirt.jpg"],
] as const;

async function upload(
  key: string,
  buffer: Buffer,
  mime: string,
  ext: string,
): Promise<string> {
  const blob = await put(key, buffer, {
    access: "public",
    contentType: mime,
    addRandomSuffix: false,
    allowOverwrite: true,
    ...getBlobPutAuthOptions(),
  });
  return blob.url;
}

async function main() {
  if (!hasBlobStorage()) throw new Error("Missing blob credentials");

  const localDir = path.join(process.cwd(), "public/assets/work/petshirts");
  await mkdir(localDir, { recursive: true });
  await mkdir(path.join(process.cwd(), "public/assets/work"), {
    recursive: true,
  });

  // Full-page marketing hero
  {
    const input = await readFile(path.join(SRC, "landing.png"));
    const { buffer, mime, ext } = await compressImageBuffer(
      input,
      "image/png",
      "lightbox",
    );
    await writeFile(path.join(process.cwd(), `public/assets/work/petshirts-hero.${ext}`), buffer);
    const url = await upload(`work/petshirts-hero.${ext}`, buffer, mime, ext);
    console.log("hero →", url);
  }

  // Card thumb: 5:4 crop from OG (or landing)
  {
    const input = await readFile(path.join(SRC, "og.jpg"));
    const meta = await sharp(input).metadata();
    const width = meta.width ?? 0;
    const height = meta.height ?? 0;
    const targetRatio = 5 / 4;
    let cropW = width;
    let cropH = Math.round(width / targetRatio);
    if (cropH > height) {
      cropH = height;
      cropW = Math.round(height * targetRatio);
    }
    const left = Math.max(0, Math.round((width - cropW) / 2));
    const top = 0;
    const cropped = await sharp(input)
      .extract({ left, top, width: cropW, height: cropH })
      .png()
      .toBuffer();
    const { buffer, mime, ext } = await compressImageBuffer(cropped, "image/png");
    await writeFile(path.join(process.cwd(), `public/assets/work/petshirts.${ext}`), buffer);
    const url = await upload(`work/petshirts.${ext}`, buffer, mime, ext);
    console.log("card →", url);
  }

  const out: Record<string, string> = {};
  for (const [slug, file] of GALLERY) {
    const input = await readFile(path.join(SRC, file));
    const mimeHint = file.endsWith(".jpg") ? "image/jpeg" : "image/png";
    const { buffer, mime, ext } = await compressImageBuffer(input, mimeHint);
    await writeFile(path.join(localDir, `${slug}.${ext}`), buffer);
    out[slug] = await upload(`work/petshirts/${slug}.${ext}`, buffer, mime, ext);
    console.log(`${slug} → ${out[slug]}`);
  }

  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
