"use client";

import { useEffect, useRef, useState } from "react";
import { compressImageForUpload } from "@/lib/admin/compress-image-client";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function WorkPreviewUpload({
  defaultImage = "",
}: {
  defaultImage?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(defaultImage ?? "");
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [uploadNote, setUploadNote] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadNote(null);
    setCompressing(true);

    try {
      const compressed = await compressImageForUpload(file);

      if (inputRef.current) {
        const transfer = new DataTransfer();
        transfer.items.add(compressed);
        inputRef.current.files = transfer.files;
      }

      if (localPreview) URL.revokeObjectURL(localPreview);
      const url = URL.createObjectURL(compressed);
      setLocalPreview(url);
      setPreview(url);

      if (compressed.size < file.size) {
        setUploadNote(
          `Compressed ${formatBytes(file.size)} → ${formatBytes(compressed.size)}`,
        );
      } else {
        setUploadNote(`Ready to upload (${formatBytes(compressed.size)})`);
      }
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Failed to compress image",
      );
      e.target.value = "";
    } finally {
      setCompressing(false);
    }
  }

  const displaySrc = localPreview ?? (preview || null);

  return (
    <div className="block">
      <span className="text-xs uppercase tracking-wider text-[#737373]">
        Preview image
      </span>

      {displaySrc && (
        <div className="relative mt-3 aspect-[5/4] max-w-md overflow-hidden border border-white/10 bg-[#0a0a0a]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displaySrc}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        name="previewFile"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onFileChange}
        disabled={compressing}
        className="mt-3 block w-full max-w-md text-sm text-[#a3a3a3] file:mr-4 file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-black hover:file:opacity-90 disabled:opacity-50"
      />

      {compressing && (
        <p className="mt-1.5 text-xs text-[#737373]">Compressing image…</p>
      )}
      {uploadNote && !compressing && (
        <p className="mt-1.5 text-xs text-[#737373]">{uploadNote}</p>
      )}
      {uploadError && (
        <p className="mt-1.5 text-xs text-[#ff453a]">{uploadError}</p>
      )}

      <input
        type="text"
        name="image"
        defaultValue={defaultImage ?? ""}
        placeholder="/assets/work/your-slug.jpg or https://..."
        className="mt-3 w-full max-w-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
      />

      <p className="mt-1.5 text-xs text-[#525252]">
        Large images are compressed before upload (max 1920px, WebP). Production
        uses Vercel Blob; local dev saves to{" "}
        <code className="text-[#ff453a]">public/assets/work/</code>. Paste a
        URL below — upload overrides the text field.
      </p>
    </div>
  );
}
