import { notFound } from "next/navigation";
import { WorkForm } from "@/components/admin/work-form";
import { deleteWork, saveWorkFromForm } from "@/lib/admin/actions";
import { getWorkById } from "@/lib/content";

export default async function AdminEditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const work = await getWorkById(id);
  if (!work) notFound();

  async function action(formData: FormData) {
    "use server";
    return saveWorkFromForm(formData, id);
  }

  async function removeAction() {
    "use server";
    await deleteWork(id);
  }

  return (
    <div>
      <h1 className="text-2xl font-medium">Edit: {work.title}</h1>
      <WorkForm work={work} action={action} removeAction={removeAction} />
    </div>
  );
}
