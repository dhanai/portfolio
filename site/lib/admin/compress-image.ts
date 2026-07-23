import sharp from "sharp";

export type CompressPreset = "preview" | "lightbox";

const PRESETS = {
  preview: {
    maxDimension: 1920,
    webpQuality: 82,
    minQuality: 58,
    maxOutputBytes: 2 * 1024 * 1024,
  },
  lightbox: {
    maxDimension: 3360,
    webpQuality: 90,
    minQuality: 78,
    maxOutputBytes: 5 * 1024 * 1024,
  },
} as const;

export async function compressImageBuffer(
  input: Buffer,
  mime: string,
  preset: CompressPreset = "preview",
): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  if (mime === "image/gif") {
    return { buffer: copyBuffer(input), mime, ext: "gif" };
  }

  const settings = PRESETS[preset];
  let pipeline = sharp(input, { animated: false }).rotate();
  const meta = await pipeline.metadata();

  if (
    (meta.width ?? 0) > settings.maxDimension ||
    (meta.height ?? 0) > settings.maxDimension
  ) {
    pipeline = pipeline.resize(settings.maxDimension, settings.maxDimension, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  let quality = settings.webpQuality;
  let buffer = copyBuffer(await pipeline.webp({ quality }).toBuffer());

  while (buffer.length > settings.maxOutputBytes && quality > settings.minQuality) {
    quality -= 4;
    buffer = copyBuffer(await sharp(buffer).webp({ quality }).toBuffer());
  }

  return { buffer, mime: "image/webp", ext: "webp" };
}

function copyBuffer(source: Buffer): Buffer {
  const copy = new Uint8Array(source.byteLength);
  copy.set(source);
  return Buffer.from(copy);
}
