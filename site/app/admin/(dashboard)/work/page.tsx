import Link from "next/link";
import { getAllProjectsAdmin } from "@/lib/content";
import { WorkSortableList } from "@/components/admin/work-sortable-list";

export default async function AdminWorkListPage() {
  const works = await getAllProjectsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Work</h1>
          <p className="mt-2 text-sm text-[#737373]">
            Projects and case studies — each item powers a project card and case study page.
          </p>
        </div>
        <Link
          href="/admin/work/new"
          className="bg-white px-4 py-2 text-sm font-medium text-black hover:opacity-90"
        >
          + New
        </Link>
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
