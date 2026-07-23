"use client";

import { WorkPreviewUpload } from "@/components/admin/work-preview-upload";
import { AdminField } from "@/components/admin/form";
import type { WorkCardAction } from "@/lib/admin/types";
import { notifyFormChanged } from "@/lib/admin/reorder-list";

export function WorkCardActionFields({
  action,
  onActionChange,
  defaultHref = "",
  defaultLightboxImage = "",
}: {
  action: WorkCardAction;
  onActionChange: (action: WorkCardAction) => void;
  defaultHref?: string | null;
  defaultLightboxImage?: string | null;
}) {
  return (
    <div className="grid gap-4">
      <label className="block">
        <span className="text-xs uppercase tracking-wider text-[#737373]">
          Card click behavior
        </span>
        <select
          name="cardAction"
          value={action}
          onChange={(e) => {
            onActionChange(e.target.value as WorkCardAction);
            notifyFormChanged(e.target);
          }}
          className="mt-1.5 w-full border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
        >
          <option value="caseStudy">Open case study page</option>
          <option value="external">Open external link</option>
          <option value="lightbox">Open image lightbox</option>
        </select>
        <p className="mt-1 text-xs text-[#525252]">
          Lightbox expands the preview (or a larger image you upload) in a modal
          instead of navigating away. External and lightbox cards skip the case
          study fields.
        </p>
      </label>

      {action === "external" && (
        <AdminField
          label="External URL"
          name="href"
          defaultValue={defaultHref ?? ""}
          hint="Opens in a new tab from the project card"
          required
        />
      )}

      {action === "lightbox" && (
        <WorkPreviewUpload
          label="Lightbox image (optional)"
          fileInputName="lightboxFile"
          textInputName="lightboxImage"
          clearInputName="clearLightboxImage"
          compressPreset="lightbox"
          defaultImage={defaultLightboxImage}
          hint="Optional larger image for the modal (kept up to ~3360px / higher quality). If empty, the card preview image is used."
        />
      )}

      {action !== "external" && <input type="hidden" name="href" value="" />}
      {action !== "lightbox" && (
        <input
          type="hidden"
          name="lightboxImage"
          value={defaultLightboxImage ?? ""}
        />
      )}
    </div>
  );
}
