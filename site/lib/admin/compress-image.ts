import sharp from "sharp";

const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 82;
const MAX_OUTPUT_BYTES = 2 * 1024 * 1024;

export async function compressImageBuffer(
  input: Buffer,
  mime: string,
): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  if (mime === "image/gif") {
    return { buffer: copyBuffer(input), mime, ext: "gif" };
  }

  let pipeline = sharp(input, { animated: false }).rotate();
  const meta = await pipeline.metadata();

  if (
    (meta.width ?? 0) > MAX_DIMENSION ||
    (meta.height ?? 0) > MAX_DIMENSION
  ) {
    pipeline = pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  let quality = WEBP_QUALITY;
  let buffer = copyBuffer(await pipeline.webp({ quality }).toBuffer());

  while (buffer.length > MAX_OUTPUT_BYTES && quality > 58) {
    quality -= 8;
    buffer = copyBuffer(await sharp(buffer).webp({ quality }).toBuffer());
  }

  return { buffer, mime: "image/webp", ext: "webp" };
}

function copyBuffer(source: Buffer): Buffer {
  const copy = new Uint8Array(source.byteLength);
  copy.set(source);
  return Buffer.from(copy);
}
