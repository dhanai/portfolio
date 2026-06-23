import { WorkForm } from "@/components/admin/work-form";
import { saveWorkFromForm } from "@/lib/admin/actions";
import { getAllProjectsAdmin } from "@/lib/content";

export default async function AdminNewWorkPage() {
  const works = await getAllProjectsAdmin();
  const nextOrder = works.length;

  async function action(formData: FormData) {
    "use server";
    return saveWorkFromForm(formData);
  }

  return (
    <div>
      <h1 className="text-2xl font-medium">New work item</h1>
      <WorkForm sortOrder={nextOrder} action={action} />
    </div>
  );
}
