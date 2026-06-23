const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;
const TARGET_MAX_BYTES = 1_200_000;
const INITIAL_QUALITY = 0.82;
const MIN_QUALITY = 0.52;

function scaleDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
) {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }
  const ratio = Math.min(maxWidth / width, maxHeight / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

export async function compressImageForUpload(file: File): Promise<File> {
  if (file.type === "image/gif") {
    if (file.size <= 2 * 1024 * 1024) return file;
    throw new Error("GIF must be under 2MB. Use JPEG, PNG, or WebP instead.");
  }

  if (
    file.size <= 400_000 &&
    (file.type === "image/webp" || file.type === "image/jpeg")
  ) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const { width, height } = scaleDimensions(
    bitmap.width,
    bitmap.height,
    MAX_WIDTH,
    MAX_HEIGHT,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = INITIAL_QUALITY;
  let mime = "image/webp";
  let blob = await canvasToBlob(canvas, mime, quality);

  if (!blob) {
    mime = "image/jpeg";
    blob = await canvasToBlob(canvas, mime, quality);
  }

  while (blob && blob.size > TARGET_MAX_BYTES && quality > MIN_QUALITY) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, mime, quality);
  }

  if (!blob) return file;

  if (blob.size >= file.size && file.size <= TARGET_MAX_BYTES) {
    return file;
  }

  const ext = mime === "image/webp" ? "webp" : "jpg";
  const baseName = file.name.replace(/\.[^.]+$/, "") || "preview";
  return new File([blob], `${baseName}.${ext}`, {
    type: mime,
    lastModified: Date.now(),
  });
}
