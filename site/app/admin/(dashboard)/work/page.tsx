import Link from "next/link";
import { getAllProjectsAdmin } from "@/lib/content";

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
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-[#111] text-xs uppercase tracking-wider text-[#737373]">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {works.map((work) => (
              <tr key={work.id} className="border-b border-white/5">
                <td className="px-4 py-3 font-medium">{work.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#737373]">
                  {work.slug}
                </td>
                <td className="px-4 py-3 text-[#737373]">{work.sortOrder}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      work.published ? "text-[#30D158]" : "text-[#737373]"
                    }
                  >
                    {work.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/work/${work.id}`}
                    className="text-[#ff453a] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {works.length === 0 && (
          <p className="p-8 text-center text-sm text-[#737373]">
            No work items yet.{" "}
            <Link href="/admin/work/new" className="text-white underline">
              Create one
            </Link>{" "}
            or run <code className="text-[#ff453a]">npm run db:seed</code>
          </p>
        )}
      </div>
    </div>
  );
}
