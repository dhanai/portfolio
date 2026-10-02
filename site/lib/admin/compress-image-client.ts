const PRESETS = {
  preview: {
    maxWidth: 1920,
    maxHeight: 1920,
    targetMaxBytes: 1_200_000,
    initialQuality: 0.82,
    minQuality: 0.52,
  },
  lightbox: {
    maxWidth: 3360,
    maxHeight: 3360,
    targetMaxBytes: 4_500_000,
    initialQuality: 0.92,
    minQuality: 0.78,
  },
} as const;

export type CompressPreset = keyof typeof PRESETS;

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

export async function compressImageForUpload(
  file: File,
  preset: CompressPreset = "preview",
): Promise<File> {
  const settings = PRESETS[preset];

  if (file.type === "image/gif") {
    if (file.size <= 2 * 1024 * 1024) return file;
    throw new Error("GIF must be under 2MB. Use JPEG, PNG, or WebP instead.");
  }

  const skipThreshold = preset === "lightbox" ? 1_200_000 : 400_000;
  if (
    file.size <= skipThreshold &&
    (file.type === "image/webp" || file.type === "image/jpeg")
  ) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const { width, height } = scaleDimensions(
    bitmap.width,
    bitmap.height,
    settings.maxWidth,
    settings.maxHeight,
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

  let quality = settings.initialQuality;
  let mime = "image/webp";
  let blob = await canvasToBlob(canvas, mime, quality);

  if (!blob) {
    mime = "image/jpeg";
    blob = await canvasToBlob(canvas, mime, quality);
  }

  while (
    blob &&
    blob.size > settings.targetMaxBytes &&
    quality > settings.minQuality
  ) {
    quality -= 0.04;
    blob = await canvasToBlob(canvas, mime, quality);
  }

  if (!blob) return file;

  if (blob.size >= file.size && file.size <= settings.targetMaxBytes) {
    return file;
  }

  const ext = mime === "image/webp" ? "webp" : "jpg";
  const baseName = file.name.replace(/\.[^.]+$/, "") || "preview";
  return new File([blob], `${baseName}.${ext}`, {
    type: mime,
    lastModified: Date.now(),
  });
}
