"use client";

import { useEffect, useState } from "react";

export function WorkPreviewUpload({
  defaultImage = "",
}: {
  defaultImage?: string | null;
}) {
  const [preview, setPreview] = useState(defaultImage ?? "");
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (localPreview) URL.revokeObjectURL(localPreview);
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    setPreview(url);
  }

  const displaySrc = localPreview ?? (preview || null);

  return (
    <div className="block">
      <span className="text-xs uppercase tracking-wider text-[#737373]">
        Preview image
      </span>

      {displaySrc && (
        <div className="relative mt-3 aspect-[16/10] max-w-md overflow-hidden border border-white/10 bg-[#0a0a0a]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displaySrc}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <input
        type="file"
        name="previewFile"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onFileChange}
        className="mt-3 block w-full max-w-md text-sm text-[#a3a3a3] file:mr-4 file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-black hover:file:opacity-90"
      />

      <input
        type="text"
        name="image"
        defaultValue={defaultImage ?? ""}
        placeholder="/assets/work/your-slug.jpg or https://..."
        className="mt-3 w-full max-w-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
      />

      <p className="mt-1.5 text-xs text-[#525252]">
        Upload saves to{" "}
        <code className="text-[#ff453a]">/assets/work/[slug].jpg</code> on
        save. Or paste a path/URL. Upload overrides the text field.
      </p>
    </div>
  );
}
