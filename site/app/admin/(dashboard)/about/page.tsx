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
    const paragraphs = String(formData.get("paragraphs"))
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const skillsRaw = String(formData.get("skillsJson"));
    let skills = about.skills;
    try {
      skills = JSON.parse(skillsRaw);
    } catch {
      return { error: "Skills must be valid JSON" };
    }

    return saveAboutContent({
      paragraphs,
      skills,
      ctaTitle: String(formData.get("ctaTitle")),
      ctaBody: String(formData.get("ctaBody")),
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-medium">About page</h1>
      <AdminForm action={action} successMessage="About page saved" className="mt-8 space-y-6">
        <AdminSection title="Bio">
          <AdminTextarea
            label="Paragraphs"
            name="paragraphs"
            defaultValue={about.paragraphs.join("\n\n")}
            rows={12}
            hint="Separate paragraphs with a blank line"
          />
        </AdminSection>

        <AdminSection title="Skills matrix">
          <AdminTextarea
            label="Skills (JSON)"
            name="skillsJson"
            defaultValue={JSON.stringify(about.skills, null, 2)}
            rows={12}
            hint='[{ "area": "...", "level": "Expert", "accent": "#BF5AF2" }]'
          />
        </AdminSection>

        <AdminSection title="CTA">
          <AdminField label="Title" name="ctaTitle" defaultValue={about.ctaTitle} />
          <AdminTextarea label="Body" name="ctaBody" defaultValue={about.ctaBody} rows={3} />
        </AdminSection>

        <AdminSubmit />
      </AdminForm>
    </div>
  );
}
