import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { compressImageBuffer } from "@/lib/admin/compress-image";
import {
  getBlobPutAuthOptions,
  hasBlobStorage,
} from "@/lib/admin/blob-credentials";

const MAX_INPUT_BYTES = 12 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function validateImage(file: File) {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No image selected");
  }
  if (!ALLOWED.has(file.type)) {
    throw new Error("Use JPEG, PNG, WebP, or GIF");
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("Image must be under 12MB before compression");
  }
}

/** Node 22 / Vercel Blob reject SharedArrayBuffer-backed views. */
function copyBytes(source: ArrayBuffer | Buffer): Buffer {
  const view =
    source instanceof Buffer ? source : new Uint8Array(source);
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
      "File uploads require Vercel Blob. Connect a Blob store in the Vercel project settings and redeploy.",
    );
  }

  const dir = path.join(process.cwd(), "public", "assets", "work");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return `/assets/work/${filename}`;
}

async function saveToBlob(
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<string> {
  const auth = getBlobPutAuthOptions();
  if (!auth.token && !auth.storeId) {
    throw new Error(
      "Blob credentials missing. In Vercel, link your public Blob store or set BLOB_READ_WRITE_TOKEN / PUBBLOB_READ_WRITE_TOKEN.",
    );
  }

  const blob = await put(`work/${filename}`, toBlobBody(buffer), {
    access: "public",
    addRandomSuffix: false,
    contentType,
    ...auth,
  });
  return blob.url;
}

export async function saveWorkPreviewImage(
  file: File,
  slug: string,
): Promise<string> {
  validateImage(file);

  const input = copyBytes(await file.arrayBuffer());
  const { buffer, mime, ext } = await compressImageBuffer(input, file.type);

  if (buffer.length > MAX_OUTPUT_BYTES) {
    throw new Error("Image is still too large after compression — try a smaller file");
  }

  const safeSlug = slugify(slug || "preview") || "preview";
  const filename = `${safeSlug}.${ext}`;

  if (useBlobStorage()) {
    return saveToBlob(buffer, filename, mime);
  }

  return saveToFilesystem(buffer, filename);
}
