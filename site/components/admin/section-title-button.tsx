"use client";

import { useCallback, useState } from "react";
import { AdminDrawer } from "@/components/admin/admin-drawer";

export function SectionTitleButton({
  title,
  drawerTitle,
  description,
  children,
}: {
  title: string;
  drawerTitle: string;
  description?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between gap-4 border border-white/10 px-4 py-4 text-left transition-colors hover:border-white/25"
      >
        <span className="min-w-0">
          <span className="block text-[10px] uppercase tracking-wider text-[#737373]">
            Section
          </span>
          <span className="mt-1 block truncate text-lg font-medium text-white">
            {title.trim() || "Untitled"}
          </span>
        </span>
        <span className="shrink-0 text-xs uppercase tracking-wider text-[#737373]">
          Edit
        </span>
      </button>
      <AdminDrawer
        open={open}
        onClose={close}
        title={drawerTitle}
        description={description}
      >
        {children}
      </AdminDrawer>
    </>
  );
}
