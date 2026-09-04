export type CompressPreset = "preview" | "lightbox" | "fullpage";

const PRESETS = {
  preview: {
    maxWidth: 1920,
    maxHeight: 1920,
    webpQuality: 82,
    minQuality: 58,
    maxOutputBytes: 2 * 1024 * 1024,
  },
  lightbox: {
    maxWidth: 3360,
    maxHeight: 3360,
    webpQuality: 90,
    minQuality: 78,
    maxOutputBytes: 5 * 1024 * 1024,
  },
  /** Tall marketing screenshots — preserve width, allow long height */
  fullpage: {
    maxWidth: 1920,
    maxHeight: 12000,
    webpQuality: 88,
    minQuality: 72,
    maxOutputBytes: 6 * 1024 * 1024,
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

  // Lazy-load so admin routes that import upload helpers don't fail SSR
  // when sharp's native binary isn't needed yet (and avoid bundling it into login).
  const sharp = (await import("sharp")).default;

  const settings = PRESETS[preset];
  let pipeline = sharp(input, { animated: false }).rotate();
  const meta = await pipeline.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  if (width > settings.maxWidth || height > settings.maxHeight) {
    pipeline = pipeline.resize(settings.maxWidth, settings.maxHeight, {
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
