"use client";

import { put } from "@vercel/blob/client";

const MAX_VIDEO_BYTES = 80 * 1024 * 1024;
const BLOB_UPLOAD_URL = "/api/admin/blob-upload";

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

async function fetchClientToken(
  pathname: string,
  itemId: string,
): Promise<string> {
  const response = await fetch(BLOB_UPLOAD_URL, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      type: "blob.generate-client-token",
      payload: {
        pathname,
        clientPayload: JSON.stringify({ itemId }),
        multipart: true,
      },
    }),
  });

  let payload: { clientToken?: string; error?: string } = {};
  try {
    payload = (await response.json()) as typeof payload;
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(
      payload.error ||
        `Upload authorization failed (${response.status}). Sign in to admin and ensure Blob READ_WRITE_TOKEN is set in Vercel.`,
    );
  }

  if (!payload.clientToken) {
    throw new Error("Upload authorization did not return a client token");
  }

  return payload.clientToken;
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
  const clientToken = await fetchClientToken(pathname, itemId);

  const result = await put(pathname, file, {
    access: "public",
    token: clientToken,
    multipart: true,
    contentType: file.type || undefined,
    onUploadProgress: onProgress
      ? ({ percentage }) => onProgress(percentage)
      : undefined,
  });

  return result.url;
}
