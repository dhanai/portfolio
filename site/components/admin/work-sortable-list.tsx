"use client";

import Link from "next/link";
import { useCallback, useState, useTransition } from "react";
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
  const [works, setWorks] = useState(initialWorks);
  const [isPending, startTransition] = useTransition();
  const { success, error: toastError } = useToast();

  const persistOrder = useCallback(
    (nextWorks: WorkRow[], previousWorks: WorkRow[]) => {
      startTransition(async () => {
        const result = await reorderWorks(nextWorks.map((work) => work.id));
        if (result && "error" in result) {
          toastError(result.error);
          setWorks(previousWorks);
          return;
        }
        success("Work order saved");
      });
    },
    [success, toastError],
  );

  const onReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      setWorks((current) => {
        const next = reorderList(current, fromIndex, toIndex);
        persistOrder(next, current);
        return next;
      });
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
    <div className={isPending ? "opacity-80" : undefined}>
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
