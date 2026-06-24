import type { CreativeShowcaseData } from "@/lib/defaults/creative-showcase";
import {
  saveCreativeImage,
  saveCreativeMedia,
} from "@/lib/admin/upload-creative-media";

function newId() {
  return `creative-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function parseCreativeShowcaseForm(
  formData: FormData,
): Promise<{ data?: CreativeShowcaseData; error?: string }> {
  const enabled = formData.get("enabled") === "on";
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const itemCount = Number(formData.get("itemCount") ?? 0);

  if (!title) {
    return { error: "Section title is required" };
  }

  const items: CreativeShowcaseData["items"] = [];

  for (let i = 0; i < itemCount; i++) {
    const prefix = `item_${i}_`;
    const id = String(formData.get(`${prefix}id`) ?? "").trim() || newId();
    let type = String(formData.get(`${prefix}type`) ?? "image") as
      | "image"
      | "video";
    const itemTitle = String(formData.get(`${prefix}title`) ?? "").trim();
    const direction = String(formData.get(`${prefix}direction`) ?? "").trim();
    let src = String(formData.get(`${prefix}src`) ?? "").trim();
    let poster = String(formData.get(`${prefix}poster`) ?? "").trim() || undefined;

    const mediaFile = formData.get(`${prefix}media`);
    if (mediaFile instanceof File && mediaFile.size > 0) {
      try {
        const uploaded = await saveCreativeMedia(mediaFile, id);
        src = uploaded.url;
        type = uploaded.type;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to upload media";
        return { error: `Item ${i + 1}: ${message}` };
      }
    }

    const posterFile = formData.get(`${prefix}posterFile`);
    if (posterFile instanceof File && posterFile.size > 0) {
      try {
        poster = await saveCreativeImage(posterFile, `${id}-poster`);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to upload poster";
        return { error: `Item ${i + 1} poster: ${message}` };
      }
    }

    if (!itemTitle) {
      return { error: `Item ${i + 1}: title is required` };
    }

    if (!src) {
      return { error: `Item ${i + 1}: upload media or paste a URL` };
    }

    items.push({
      id,
      type,
      src,
      poster,
      title: itemTitle,
      direction: direction || undefined,
      alt: itemTitle,
    });
  }

  return {
    data: {
      enabled,
      title,
      subtitle,
      items,
    },
  };
}
