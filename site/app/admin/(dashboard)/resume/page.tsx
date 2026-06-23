import { saveResumeContent } from "@/lib/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminSection, AdminSubmit, AdminTextarea } from "@/components/admin/form";
import { getResumeContent } from "@/lib/content";

export default async function AdminResumePage() {
  const resume = await getResumeContent();

  async function action(formData: FormData) {
    "use server";
    const raw = String(formData.get("resumeJson"));
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return { error: "Resume must be valid JSON" };
    }
    return saveResumeContent(data);
  }

  return (
    <div>
      <h1 className="text-2xl font-medium">Resume</h1>
      <p className="mt-2 text-sm text-[#737373]">
        Full resume for web + PDF. After saving, run{" "}
        <code className="text-[#ff453a]">npm run resume:pdf</code> or rebuild to refresh the PDF file.
      </p>
      <AdminForm action={action} successMessage="Resume saved" className="mt-8 space-y-6">
        <AdminSection title="Resume JSON">
          <AdminTextarea
            label="Content"
            name="resumeJson"
            defaultValue={JSON.stringify(resume, null, 2)}
            rows={28}
            required
          />
        </AdminSection>
        <AdminSubmit />
      </AdminForm>
    </div>
  );
}
