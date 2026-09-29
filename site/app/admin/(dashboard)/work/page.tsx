import { AdminCreateDrawer } from "@/components/admin/admin-create-drawer";
import { WorkForm } from "@/components/admin/work-form";
import { WorkSectionTitleForm } from "@/components/admin/work-section-title-form";
import { WorkSortableList } from "@/components/admin/work-sortable-list";
import { saveWorkFromForm } from "@/lib/admin/actions";
import { getAllProjectsAdmin, getSiteContent } from "@/lib/content";

export default async function AdminWorkListPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const { new: create } = await searchParams;
  const [works, site] = await Promise.all([
    getAllProjectsAdmin(),
    getSiteContent(),
  ]);

  async function action(formData: FormData) {
    "use server";
    return saveWorkFromForm(formData);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium">Work</h1>
          <p className="mt-2 text-sm text-[#737373]">
            Projects and case studies
          </p>
        </div>
        <AdminCreateDrawer
          title="New work item"
          description="Project card and optional case study. It shows up in the work rail as soon as it’s published."
          triggerLabel="+ New"
          queryOpen={create === "1"}
        >
          <WorkForm action={action} className="space-y-6" />
        </AdminCreateDrawer>
      </div>

      <div className="mt-8">
        <WorkSectionTitleForm initialTitle={site.workSectionTitle} />
      </div>

      <div className="mt-8 overflow-hidden border border-white/10">
        <WorkSortableList
          works={works.map((work) => ({
            id: work.id,
            title: work.title,
            slug: work.slug,
            published: work.published,
          }))}
        />
      </div>
    </div>
  );
}
