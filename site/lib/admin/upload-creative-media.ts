import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import {
  getBlobPutAuthOptions,
  hasBlobStorage,
} from "@/lib/admin/blob-credentials";

const MAX_IMAGE_INPUT = 12 * 1024 * 1024;
const MAX_IMAGE_OUTPUT = 2 * 1024 * 1024;
const MAX_VIDEO_BYTES = 80 * 1024 * 1024;

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function copyBytes(source: ArrayBuffer | Buffer): Buffer {
  const view = source instanceof Buffer ? source : new Uint8Array(source);
  const copy = new Uint8Array(view.byteLength);
  copy.set(view);
  return Buffer.from(copy);
}

function toBlobBody(buffer: Buffer): Buffer {
  const copy = new Uint8Array(buffer.byteLength);
  copy.set(buffer);
  return Buffer.from(copy);
}

function useBlobStorage() {
  return hasBlobStorage() || process.env.VERCEL === "1";
}

async function saveToFilesystem(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  if (process.env.VERCEL === "1") {
    throw new Error(
      "File uploads require Vercel Blob. Connect a Blob store in Vercel project settings.",
    );
  }

  const dir = path.join(process.cwd(), "public", "assets", "creative");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return `/assets/creative/${filename}`;
}

async function saveToBlob(
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<string> {
  const auth = getBlobPutAuthOptions();
  if (!auth.token && !auth.storeId) {
    throw new Error(
      "Blob credentials missing. Link your public Blob store in Vercel or set PUBBLOB_READ_WRITE_TOKEN.",
    );
  }

  const blob = await put(`creative/${filename}`, toBlobBody(buffer), {
    access: "public",
    addRandomSuffix: false,
    contentType,
    ...auth,
  });
  return blob.url;
}

function extForVideo(mime: string) {
  if (mime === "video/webm") return "webm";
  if (mime === "video/quicktime") return "mov";
  return "mp4";
}

export async function saveCreativeImage(
  file: File,
  id: string,
): Promise<string> {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No image selected");
  }
  if (!IMAGE_TYPES.has(file.type)) {
    throw new Error("Use JPEG, PNG, WebP, or GIF for images");
  }
  if (file.size > MAX_IMAGE_INPUT) {
    throw new Error("Image must be under 12MB before compression");
  }

  const input = copyBytes(await file.arrayBuffer());
  const { buffer, mime, ext } = await compressImageBuffer(input, file.type);

  if (buffer.length > MAX_IMAGE_OUTPUT) {
    throw new Error("Image is still too large after compression");
  }

  const safeId = slugify(id) || "creative";
  const filename = `${safeId}.${ext}`;

  if (useBlobStorage()) {
    return saveToBlob(buffer, filename, mime);
  }
  return saveToFilesystem(buffer, filename);
}

export async function saveCreativeVideo(
  file: File,
  id: string,
): Promise<string> {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No video selected");
  }
  if (!VIDEO_TYPES.has(file.type)) {
    throw new Error("Use MP4, WebM, or MOV for video");
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error("Video must be under 80MB");
  }

  const buffer = copyBytes(await file.arrayBuffer());
  const safeId = slugify(id) || "creative";
  const ext = extForVideo(file.type);
  const filename = `${safeId}.${ext}`;

  if (useBlobStorage()) {
    return saveToBlob(buffer, filename, file.type);
  }
  return saveToFilesystem(buffer, filename);
}

export async function saveCreativeMedia(
  file: File,
  id: string,
): Promise<{ url: string; type: "image" | "video" }> {
  if (file.type.startsWith("video/")) {
    return { url: await saveCreativeVideo(file, id), type: "video" };
  }
  if (IMAGE_TYPES.has(file.type)) {
    return { url: await saveCreativeImage(file, id), type: "image" };
  }
  throw new Error("Upload an image (JPEG, PNG, WebP, GIF) or video (MP4, WebM, MOV)");
}
