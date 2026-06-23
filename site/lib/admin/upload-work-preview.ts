import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function saveWorkPreviewImage(
  file: File,
  slug: string,
): Promise<string> {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No image selected");
  }
  if (!ALLOWED.has(file.type)) {
    throw new Error("Use JPEG, PNG, WebP, or GIF");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be under 5MB");
  }

  const safeSlug = slugify(slug || "preview") || "preview";
  const ext = EXT[file.type] ?? "jpg";
  const filename = `${safeSlug}.${ext}`;
  const dir = path.join(process.cwd(), "public", "assets", "work");

  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, filename),
    Buffer.from(await file.arrayBuffer()),
  );

  return `/assets/work/${filename}`;
}
