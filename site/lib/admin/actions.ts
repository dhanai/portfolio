"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import {
  defaultSession,
  getAdminPassword,
  sessionOptions,
  type AdminSession,
} from "@/lib/auth/session";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import type { AboutContentData, SiteContentData, CreativeShowcaseData } from "@/lib/content";
import type { ResumeContentData } from "@/lib/content";
import type { ActionResult, WorkFormData } from "@/lib/admin/types";
import { isSameJson } from "@/lib/admin/diff";
import { parseCreativeShowcaseForm } from "@/lib/admin/parse-creative-form";
import { saveWorkPreviewImage } from "@/lib/admin/upload-work-preview";
import { parseWorkFormData } from "@/lib/admin/parse-work-form";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (password !== getAdminPassword()) {
    redirect("/admin/login?error=1");
  }
  const session = await getIronSession<AdminSession>(
    await cookies(),
    sessionOptions,
  );
  session.isLoggedIn = true;
  await session.save();
  redirect("/admin");
}

export async function logoutAction() {
  const session = await getIronSession<AdminSession>(
    await cookies(),
    sessionOptions,
  );
  session.isLoggedIn = false;
  await session.save();
  redirect("/admin/login");
}

async function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/about");
  revalidatePath("/resume");
}

export async function saveSiteContent(data: SiteContentData): Promise<ActionResult> {
  await requireAdmin();
  const existing = await prisma.contentBlock.findUnique({ where: { key: "site" } });
  if (existing && isSameJson(JSON.parse(existing.data), data)) {
    return { unchanged: true };
  }
  await prisma.contentBlock.upsert({
    where: { key: "site" },
    create: { key: "site", data: JSON.stringify(data) },
    update: { data: JSON.stringify(data) },
  });
  await revalidateAll();
  return { ok: true as const };
}

export async function saveAboutContent(data: AboutContentData): Promise<ActionResult> {
  await requireAdmin();
  const existing = await prisma.contentBlock.findUnique({ where: { key: "about" } });
  if (existing && isSameJson(JSON.parse(existing.data), data)) {
    return { unchanged: true };
  }
  await prisma.contentBlock.upsert({
    where: { key: "about" },
    create: { key: "about", data: JSON.stringify(data) },
    update: { data: JSON.stringify(data) },
  });
  await revalidateAll();
  return { ok: true as const };
}

export async function saveResumeContent(data: ResumeContentData): Promise<ActionResult> {
  await requireAdmin();
  const existing = await prisma.contentBlock.findUnique({ where: { key: "resume" } });
  if (existing && isSameJson(JSON.parse(existing.data), data)) {
    return { unchanged: true };
  }
  await prisma.contentBlock.upsert({
    where: { key: "resume" },
    create: { key: "resume", data: JSON.stringify(data) },
    update: { data: JSON.stringify(data) },
  });
  await revalidateAll();
  return { ok: true as const };
}

export async function saveCreativeShowcase(
  data: CreativeShowcaseData,
): Promise<ActionResult> {
  await requireAdmin();
  const existing = await prisma.contentBlock.findUnique({ where: { key: "creative" } });
  if (existing && isSameJson(JSON.parse(existing.data), data)) {
    return { unchanged: true };
  }
  await prisma.contentBlock.upsert({
    where: { key: "creative" },
    create: { key: "creative", data: JSON.stringify(data) },
    update: { data: JSON.stringify(data) },
  });
  await revalidateAll();
  return { ok: true as const };
}

export async function saveCreativeShowcaseFromForm(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = await parseCreativeShowcaseForm(formData);
  if (parsed.error) return { error: parsed.error };
  if (!parsed.data) return { error: "Invalid form data" };
  return saveCreativeShowcase(parsed.data);
}

export async function saveWorkFromForm(
  formData: FormData,
  workId?: string,
): Promise<ActionResult | void> {
  const data = parseWorkFormData(formData, workId);
  const previewFile = formData.get("previewFile");

  if (previewFile instanceof File && previewFile.size > 0) {
    try {
      data.image = await saveWorkPreviewImage(previewFile, data.slug);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to upload image";
      return { error: message };
    }
  }

  return saveWork(data);
}

export async function saveWork(data: WorkFormData): Promise<ActionResult | void> {
  await requireAdmin();

  const slug = slugify(data.slug || data.title);
  if (!slug) return { error: "Slug is required" };

  let sections: unknown;
  try {
    sections = JSON.parse(data.sectionsJson);
  } catch {
    return { error: "Sections must be valid JSON" };
  }

  const tags = data.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const payload = {
    slug,
    title: data.title,
    subtitle: data.subtitle,
    tags: JSON.stringify(tags),
    year: data.year,
    color: data.color || "#FF453A",
    href: data.href || null,
    image: data.image || null,
    role: data.role,
    externalUrl: data.externalUrl || null,
    diagram: data.diagram || null,
    reflection: data.reflection,
    sections: JSON.stringify(sections),
    published: data.published,
    sortOrder: 0,
  };

  if (data.id) {
    const existing = await prisma.work.findUnique({ where: { id: data.id } });
    if (!existing) return { error: "Work not found" };
    payload.sortOrder = existing.sortOrder;
    if (existing.slug !== slug) {
      const conflict = await prisma.work.findUnique({ where: { slug } });
      if (conflict) return { error: "Slug already in use" };
    }
    if (
      isSameJson(payload, {
        slug: existing.slug,
        title: existing.title,
        subtitle: existing.subtitle,
        tags: existing.tags,
        year: existing.year,
        color: existing.color,
        href: existing.href,
        image: existing.image,
        role: existing.role,
        externalUrl: existing.externalUrl,
        diagram: existing.diagram,
        reflection: existing.reflection,
        sections: existing.sections,
        published: existing.published,
        sortOrder: existing.sortOrder,
      })
    ) {
      return { unchanged: true };
    }
    await prisma.work.update({ where: { id: data.id }, data: payload });
  } else {
    const conflict = await prisma.work.findUnique({ where: { slug } });
    if (conflict) return { error: "Slug already in use" };
    const maxOrder = await prisma.work.aggregate({ _max: { sortOrder: true } });
    payload.sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;
    await prisma.work.create({ data: payload });
  }

  await revalidateAll();
  revalidatePath(`/work/${slug}`);
  redirect("/admin/work");
}

export async function reorderWorks(orderedIds: string[]): Promise<ActionResult> {
  await requireAdmin();

  if (orderedIds.length === 0) {
    return { ok: true };
  }

  const existing = await prisma.work.findMany({
    where: { id: { in: orderedIds } },
    select: { id: true },
  });

  if (existing.length !== orderedIds.length) {
    return { error: "One or more work items were not found" };
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.work.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );

  await revalidateAll();
  return { ok: true };
}

export async function deleteWork(id: string) {
  await requireAdmin();
  await prisma.work.delete({ where: { id } });
  await revalidateAll();
  redirect("/admin/work");
}

export async function seedDatabaseAction() {
  await requireAdmin();
  const { execSync } = await import("child_process");
  execSync("npx tsx prisma/seed.ts", { cwd: process.cwd(), stdio: "inherit" });
  await revalidateAll();
  return { ok: true };
}
