import type { WorkCardAction, WorkFormData } from "@/lib/admin/types";

function parseCardAction(value: FormDataEntryValue | null): WorkCardAction {
  const raw = String(value ?? "caseStudy");
  if (raw === "external" || raw === "lightbox") return raw;
  return "caseStudy";
}

export function parseWorkFormData(
  formData: FormData,
  workId?: string,
): WorkFormData {
  return {
    id: workId,
    slug: String(formData.get("slug")),
    title: String(formData.get("title")),
    subtitle: String(formData.get("subtitle")),
    tags: String(formData.get("tags")),
    year: String(formData.get("year")),
    color: String(formData.get("color")),
    href: String(formData.get("href")),
    image: String(formData.get("image")),
    cardAction: parseCardAction(formData.get("cardAction")),
    lightboxImage: String(formData.get("lightboxImage")),
    role: String(formData.get("role")),
    externalUrl: String(formData.get("externalUrl")),
    diagram: String(formData.get("diagram")),
    reflection: String(formData.get("reflection")),
    sectionsJson: String(formData.get("sectionsJson")),
    published: formData.get("published") === "on",
  };
}
