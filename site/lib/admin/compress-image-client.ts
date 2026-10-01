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

/** Grab a still from a local video file to use as its poster. */
export async function captureVideoFrame(
  file: File,
  atSeconds = 1,
): Promise<File | null> {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = url;

  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("Could not read video"));
    });
    video.currentTime = Math.min(atSeconds, (video.duration || 0) / 2);
    await new Promise<void>((resolve, reject) => {
      video.onseeked = () => resolve();
      video.onerror = () => reject(new Error("Could not seek video"));
    });

    const { width, height } = scaleDimensions(
      video.videoWidth,
      video.videoHeight,
      PRESETS.preview.maxWidth,
      PRESETS.preview.maxHeight,
    );
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, "image/jpeg", 0.88);
    if (!blob) return null;
    const baseName = file.name.replace(/\.[^.]+$/, "") || "poster";
    return new File([blob], `${baseName}-poster.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
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
