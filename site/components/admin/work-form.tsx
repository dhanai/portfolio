import { AdminForm } from "@/components/admin/admin-form";
import { WorkPreviewUpload } from "@/components/admin/work-preview-upload";
import {
  AdminCheckbox,
  AdminField,
  AdminSection,
  AdminSubmit,
  AdminTextarea,
} from "@/components/admin/form";
import type { ActionResult } from "@/lib/admin/types";
import type { Work } from "@prisma/client";

const defaultSections = `[
  {
    "heading": "Overview",
    "paragraphs": ["Describe the project."],
    "bullets": []
  }
]`;

export function WorkForm({
  work,
  action,
  removeAction,
}: {
  work?: Work;
  action: (formData: FormData) => Promise<ActionResult | void>;
  removeAction?: () => Promise<void>;
}) {
  const tags = work ? JSON.parse(work.tags).join(", ") : "";
  const sectionsJson = work
    ? JSON.stringify(JSON.parse(work.sections), null, 2)
    : defaultSections;

  return (
    <AdminForm
      action={action}
      alwaysEnableSubmit={!work}
      className="mt-8 space-y-6"
    >
      {work?.id && <input type="hidden" name="id" value={work.id} />}

      <AdminSection title="Project card">
        <AdminField label="Title" name="title" defaultValue={work?.title} required />
        <AdminField label="Slug" name="slug" defaultValue={work?.slug} hint="URL: /work/your-slug" required />
        <AdminField label="Subtitle" name="subtitle" defaultValue={work?.subtitle} required />
        <AdminField label="Tags" name="tags" defaultValue={tags} hint="Comma-separated" />
        <AdminField label="Year" name="year" defaultValue={work?.year ?? "2024"} />
        <AdminField label="Accent color" name="color" defaultValue={work?.color ?? "#FF453A"} />
        <AdminField label="Card link (optional)" name="href" defaultValue={work?.href ?? ""} hint="External URL skips case study page" />
        <WorkPreviewUpload defaultImage={work?.image} />
        <AdminCheckbox label="Published" name="published" defaultChecked={work?.published ?? true} />
      </AdminSection>

      <AdminSection title="Case study">
        <AdminField label="Role" name="role" defaultValue={work?.role ?? ""} required />
        <AdminField label="External URL" name="externalUrl" defaultValue={work?.externalUrl ?? ""} />
        <AdminField label="Diagram path" name="diagram" defaultValue={work?.diagram ?? ""} hint="/assets/diagrams/..." />
        <AdminTextarea label="Reflection" name="reflection" defaultValue={work?.reflection ?? ""} rows={3} required />
        <AdminTextarea
          label="Sections (JSON)"
          name="sectionsJson"
          defaultValue={sectionsJson}
          rows={16}
          hint='Array of { heading, paragraphs: string[], bullets?: string[] }'
          required
        />
      </AdminSection>

      <div className="flex flex-wrap items-center gap-4">
        <AdminSubmit label={work ? "Update work" : "Create work"} />
        {removeAction && (
          <button
            formAction={removeAction}
            type="submit"
            className="border border-[#ff453a]/50 px-5 py-2.5 text-sm text-[#ff453a] hover:bg-[#ff453a]/10"
          >
            Delete
          </button>
        )}
      </div>
    </AdminForm>
  );
}
