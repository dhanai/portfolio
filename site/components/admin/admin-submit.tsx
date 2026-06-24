"use client";

import { useFormStatus } from "react-dom";
import { useAdminForm } from "@/components/admin/admin-form";

export function AdminSubmit({
  label = "Save",
  pendingLabel = "Saving…",
  idleLabel,
}: {
  label?: string;
  pendingLabel?: string;
  idleLabel?: string;
}) {
  const { pending } = useFormStatus();
  const { isDirty, alwaysEnableSubmit, isPreparing } = useAdminForm();
  const canSave = alwaysEnableSubmit || isDirty;
  const disabled = pending || isPreparing || !canSave;
  const displayLabel = idleLabel ?? label;

  return (
    <button
      type="submit"
      disabled={disabled}
      aria-busy={pending || isPreparing}
      aria-disabled={disabled}
      className="inline-flex min-w-[7rem] items-center justify-center gap-2 bg-white px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {isPreparing ? (
        <>
          <span
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black"
            aria-hidden="true"
          />
          Uploading videos…
        </>
      ) : pending ? (
        <>
          <span
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black"
            aria-hidden="true"
          />
          {pendingLabel}
        </>
      ) : (
        displayLabel
      )}
    </button>
  );
}
