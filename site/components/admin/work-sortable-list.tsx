"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { reorderWorks } from "@/lib/admin/actions";
import { reorderList } from "@/lib/admin/reorder-list";
import { useToast } from "@/components/toast";
import { DragHandle, useDragReorder } from "@/components/admin/drag-reorder";

type WorkRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
};

export function WorkSortableList({ works: initialWorks }: { works: WorkRow[] }) {
  const router = useRouter();
  const [works, setWorks] = useState(initialWorks);
  const worksRef = useRef(initialWorks);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    worksRef.current = initialWorks;
    setWorks(initialWorks);
  }, [initialWorks]);

  const persistOrder = useCallback(
    async (nextWorks: WorkRow[], previousWorks: WorkRow[]) => {
      const orderedIds = nextWorks.map((work) => work.id);
      if (orderedIds.length === 0) {
        toastError("Could not save work order");
        setWorks(previousWorks);
        return;
      }

      try {
        const result = await reorderWorks(orderedIds);
        if (result && "error" in result) {
          toastError(result.error);
          worksRef.current = previousWorks;
          setWorks(previousWorks);
          return;
        }

        success("Work order saved");
        router.refresh();
      } catch (err) {
        toastError(err instanceof Error ? err.message : "Failed to save work order");
        worksRef.current = previousWorks;
        setWorks(previousWorks);
      }
    },
    [router, success, toastError],
  );

  const onReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      const previousWorks = worksRef.current;
      const nextWorks = reorderList(previousWorks, fromIndex, toIndex);
      if (nextWorks === previousWorks) return;

      worksRef.current = nextWorks;
      setWorks(nextWorks);
      void persistOrder(nextWorks, previousWorks);
    },
    [persistOrder],
  );

  const drag = useDragReorder(onReorder);

  if (works.length === 0) {
    return (
      <p className="p-8 text-center text-sm text-[#737373]">
        No work items yet.{" "}
        <Link href="/admin/work/new" className="text-white underline">
          Create one
        </Link>{" "}
        or run <code className="text-[#ff453a]">npm run db:seed</code>
      </p>
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs text-[#525252]">
        Drag rows to reorder homepage work cards.
      </p>
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 bg-[#111] text-xs uppercase tracking-wider text-[#737373]">
          <tr>
            <th className="w-10 px-2 py-3" aria-label="Reorder" />
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Slug</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {works.map((work, index) => (
            <tr
              key={work.id}
              className={drag.getRowClassName(index, "border-b border-white/5")}
              onDragOver={(event) => drag.handleDragOver(index, event)}
              onDragLeave={drag.handleDragLeave}
              onDrop={(event) => drag.handleDrop(index, event)}
            >
              <td className="px-2 py-3 align-middle">
                <DragHandle
                  index={index}
                  onDragStart={drag.handleDragStart}
                  onDragEnd={drag.handleDragEnd}
                />
              </td>
              <td className="px-4 py-3 font-medium">{work.title}</td>
              <td className="px-4 py-3 font-mono text-xs text-[#737373]">
                {work.slug}
              </td>
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
    </div>
  );
}
