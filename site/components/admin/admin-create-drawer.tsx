"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdminDrawer } from "@/components/admin/admin-drawer";

export function AdminCreateDrawer({
  title,
  description,
  triggerLabel,
  queryOpen = false,
  children,
}: {
  title: string;
  description?: string;
  triggerLabel: string;
  queryOpen?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(queryOpen);

  useEffect(() => {
    if (queryOpen) setOpen(true);
  }, [queryOpen]);

  const close = useCallback(() => {
    setOpen(false);
    if (queryOpen) router.replace(pathname, { scroll: false });
  }, [pathname, queryOpen, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 shrink-0 items-center justify-center bg-white px-4 text-sm font-medium text-black hover:opacity-90"
      >
        {triggerLabel}
      </button>
      <AdminDrawer open={open} onClose={close} title={title} description={description}>
        {children}
      </AdminDrawer>
    </>
  );
}
