import { saveAboutContent } from "@/lib/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import {
  AdminField,
  AdminSection,
  AdminSubmit,
  AdminTextarea,
} from "@/components/admin/form";
import { getAboutContent } from "@/lib/content";

export default async function AdminAboutPage() {
  const about = await getAboutContent();

  async function action(formData: FormData) {
    "use server";
    const current = await getAboutContent();
    const paragraphs = String(formData.get("paragraphs"))
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean);

    return saveAboutContent({
      paragraphs,
      // Skills matrix is no longer shown on the one-pager; preserve existing.
      skills: current.skills,
      ctaTitle: String(formData.get("ctaTitle")),
      ctaBody: String(formData.get("ctaBody")),
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-medium">About</h1>
      <p className="mt-2 text-sm text-[#737373]">
        Homepage about block (lower section next to resume CTA). There is no
        separate /about page anymore.
      </p>
      <AdminForm action={action} successMessage="About saved" className="mt-8 space-y-6">
        <AdminSection title="Bio">
          <AdminTextarea
            label="Paragraphs"
            name="paragraphs"
            defaultValue={about.paragraphs.join("\n\n")}
            rows={12}
            hint="Separate paragraphs with a blank line"
          />
        </AdminSection>

        <AdminSection title="CTA card">
          <AdminField label="Title" name="ctaTitle" defaultValue={about.ctaTitle} />
          <AdminTextarea label="Body" name="ctaBody" defaultValue={about.ctaBody} rows={3} />
        </AdminSection>

        <AdminSubmit />
      </AdminForm>
    </div>
  );
}
