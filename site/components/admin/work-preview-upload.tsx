"use client";

import { useEffect, useRef, useState } from "react";
import { compressImageForUpload } from "@/lib/admin/compress-image-client";
import type { CompressPreset } from "@/lib/admin/compress-image-client";
import {
  assignFileToInput,
  FileDropZone,
} from "@/components/admin/file-drop-zone";
import { notifyFormChanged } from "@/lib/admin/reorder-list";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export function WorkPreviewUpload({
  defaultImage = "",
  label = "Preview image",
  fileInputName = "previewFile",
  textInputName = "image",
  clearInputName = "clearImage",
  compressPreset = "preview",
  hint = "Large images are compressed before upload (max 1920px, WebP). Production uses Vercel Blob; local dev saves to public/assets/work/. Paste a URL below — upload overrides the text field.",
}: {
  defaultImage?: string | null;
  label?: string;
  fileInputName?: string;
  textInputName?: string;
  clearInputName?: string;
  compressPreset?: CompressPreset;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(defaultImage ?? "");
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [uploadNote, setUploadNote] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  function markDirty(node: HTMLElement | null = inputRef.current) {
    notifyFormChanged(node ?? urlRef.current);
  }

  async function processFile(file: File) {
    setUploadError(null);
    setUploadNote(null);
    setRemoved(false);
    setCompressing(true);

    try {
      const compressed = await compressImageForUpload(file, compressPreset);
      assignFileToInput(inputRef.current, compressed);

      if (localPreview) URL.revokeObjectURL(localPreview);
      const url = URL.createObjectURL(compressed);
      setLocalPreview(url);
      setImageUrl("");
      setUploadNote(
        compressed.size < file.size
          ? `Compressed ${formatBytes(file.size)} → ${formatBytes(compressed.size)}`
          : `Ready to upload (${formatBytes(compressed.size)})`,
      );
      markDirty(inputRef.current);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Failed to compress image",
      );
      if (inputRef.current) inputRef.current.value = "";
    } finally {
      setCompressing(false);
    }
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  }

  function clearImage() {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    setImageUrl("");
    setRemoved(true);
    setUploadNote("Image will be removed on save");
    setUploadError(null);
    if (inputRef.current) inputRef.current.value = "";
    markDirty(urlRef.current);
  }

  const displaySrc = localPreview ?? (!removed && imageUrl ? imageUrl : null);
  const hasImage = Boolean(displaySrc);

  return (
    <div className="block">
      <span className="text-xs uppercase tracking-wider text-[#737373]">
        {label}
      </span>

      <FileDropZone
        accept={ACCEPT}
        disabled={compressing}
        onFile={processFile}
        className="mt-3 max-w-md p-3"
      >
        {displaySrc ? (
          <div className="relative aspect-[5/4] overflow-hidden border border-white/10 bg-[#050505]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displaySrc}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-[5/4] items-center justify-center text-center text-xs text-[#525252]">
            Drag an image here or choose a file
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            name={fileInputName}
            accept={ACCEPT}
            onChange={onFileChange}
            disabled={compressing}
            className="block min-w-0 flex-1 text-sm text-[#a3a3a3] file:mr-4 file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-black hover:file:opacity-90 disabled:opacity-50"
          />
          {hasImage && (
            <button
              type="button"
              onClick={clearImage}
              disabled={compressing}
              className="shrink-0 text-xs text-[#ff453a] hover:text-white disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
      </FileDropZone>

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
        ref={urlRef}
        type="text"
        name={textInputName}
        value={imageUrl}
        onChange={(e) => {
          setRemoved(false);
          setImageUrl(e.target.value);
          if (localPreview) {
            URL.revokeObjectURL(localPreview);
            setLocalPreview(null);
          }
          if (inputRef.current) inputRef.current.value = "";
          markDirty(e.target);
        }}
        placeholder="/assets/work/your-slug.jpg or https://..."
        className="mt-3 w-full max-w-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
      />

      {removed && <input type="hidden" name={clearInputName} value="1" />}

      <p className="mt-1.5 text-xs text-[#525252]">{hint}</p>
    </div>
  );
}
