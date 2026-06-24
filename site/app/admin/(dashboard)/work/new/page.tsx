import { WorkForm } from "@/components/admin/work-form";
import { saveWorkFromForm } from "@/lib/admin/actions";

export default async function AdminNewWorkPage() {
  async function action(formData: FormData) {
    "use server";
    return saveWorkFromForm(formData);
  }

  return (
    <div>
      <h1 className="text-2xl font-medium">New work item</h1>
      <WorkForm action={action} />
    </div>
  );
}
