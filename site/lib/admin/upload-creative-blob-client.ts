"use client";

import { upload } from "@vercel/blob/client";

const MAX_VIDEO_BYTES = 80 * 1024 * 1024;

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "creative"
  );
}

function extForVideo(file: File) {
  const fromName = file.name.match(/\.(mp4|webm|mov)$/i)?.[1]?.toLowerCase();
  if (fromName === "mov" || file.type === "video/quicktime") return ".mov";
  if (fromName === "webm" || file.type === "video/webm") return ".webm";
  return ".mp4";
}

export async function uploadCreativeVideoToBlob(
  file: File,
  itemId: string,
  onProgress?: (percent: number) => void,
): Promise<string> {
  if (!file.type.startsWith("video/")) {
    throw new Error("Use MP4, WebM, or MOV for video");
  }
  if (!VIDEO_TYPES.has(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
    throw new Error("Use MP4, WebM, or MOV for video");
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error("Video must be under 80MB");
  }

  const pathname = `creative/${slugify(itemId)}${extForVideo(file)}`;

  const result = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/admin/blob-upload",
    clientPayload: JSON.stringify({ itemId }),
    multipart: true,
    contentType: file.type || undefined,
    onUploadProgress: onProgress
      ? ({ percentage }) => onProgress(percentage)
      : undefined,
  });

  return result.url;
}
