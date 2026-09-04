"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { CreativeShowcaseItem } from "@/lib/defaults/creative-showcase";
import { compressImageForUpload } from "@/lib/admin/compress-image-client";
import { uploadCreativeVideoToBlob } from "@/lib/admin/upload-creative-blob-client";
import { reorderList } from "@/lib/admin/reorder-list";
import {
  saveCreativeShowcaseItems,
  uploadCreativeItemMedia,
  uploadCreativeItemPoster,
} from "@/lib/admin/actions";
import { DragHandle, useDragReorder } from "@/components/admin/drag-reorder";
import { FileDropZone } from "@/components/admin/file-drop-zone";
import { useToast } from "@/components/toast";

type ItemMedia = { src: string; type: "image" | "video" };

type ModalDraft = {
  item: CreativeShowcaseItem;
  media: ItemMedia;
  localSrc: string | null;
  localPoster: string | null;
  pendingVideo: File | null;
  pendingImage: File | null;
  pendingPoster: File | null;
  isNew: boolean;
  baseline: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function newItem(): CreativeShowcaseItem {
  return {
    id: `creative-${crypto.randomUUID().slice(0, 8)}`,
    type: "image",
    src: "",
    title: "",
    direction: "",
    alt: "",
    hidden: false,
  };
}

function draftSignature(
  draft: Omit<
    ModalDraft,
    "baseline" | "isNew" | "pendingVideo" | "pendingImage" | "pendingPoster"
  >,
) {
  return JSON.stringify({
    item: draft.item,
    media: draft.media,
    hasLocal: Boolean(draft.localSrc),
    hasPoster: Boolean(draft.localPoster),
  });
}

function initMediaByItemId(items: CreativeShowcaseItem[]): Record<string, ItemMedia> {
  return Object.fromEntries(
    items.map((item) => [item.id, { src: item.src, type: item.type }]),
  );
}

function ThumbMedia({
  src,
  type,
  poster,
  alt,
}: {
  src: string;
  type: "image" | "video";
  poster?: string;
  alt: string;
}) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0a0a0a] text-[10px] uppercase tracking-wider text-[#525252]">
        No media
      </div>
    );
  }

  if (type === "video") {
    return (
      <video
        src={src}
        poster={poster}
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="h-full w-full object-cover" />
  );
}

function PieceModal({
  draft,
  onChange,
  onClose,
  onSave,
  onDelete,
  compressing,
  saving,
  uploadNote,
  uploadError,
  onProcessMedia,
  onProcessPoster,
}: {
  draft: ModalDraft;
  onChange: (patch: Partial<ModalDraft>) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
  compressing: boolean;
  saving: boolean;
  uploadNote: string | null;
  uploadError: string | null;
  onProcessMedia: (file: File) => Promise<void>;
  onProcessPoster: (file: File) => Promise<void>;
}) {
  const titleId = useId();
  const titleRef = useRef<HTMLInputElement>(null);
  const previewSrc = draft.localSrc ?? draft.media.src;
  const dirty = draftSignature(draft) !== draft.baseline;
  const canSave =
    draft.item.title.trim().length > 0 &&
    Boolean(previewSrc || draft.pendingImage || draft.pendingVideo) &&
    !compressing &&
    !saving;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    titleRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (dirty && !window.confirm("Discard unsaved changes to this piece?")) {
        return;
      }
      onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dirty, onClose]);

  function requestClose() {
    if (dirty && !window.confirm("Discard unsaved changes to this piece?")) {
      return;
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[min(92vh,900px)] w-full max-w-3xl flex-col overflow-hidden border border-white/10 bg-[#050505] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p id={titleId} className="text-sm font-medium text-white">
              {draft.isNew ? "Add piece" : "Edit piece"}
            </p>
            <p className="mt-0.5 text-xs text-[#737373]">
              Saves immediately to the homepage rail and /ai
            </p>
          </div>
          <button
            type="button"
            onClick={requestClose}
            className="flex h-8 w-8 items-center justify-center text-[#737373] transition-colors hover:text-white"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-6 overflow-y-auto p-5 md:grid-cols-[200px_1fr]">
          <div className="space-y-3">
            <div className="aspect-[9/16] overflow-hidden border border-white/10 bg-[#0a0a0a]">
              <ThumbMedia
                src={previewSrc}
                type={draft.media.type}
                poster={draft.localPoster ?? draft.item.poster}
                alt={draft.item.title || "Preview"}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-[#737373]">
                Title
              </span>
              <input
                ref={titleRef}
                value={draft.item.title}
                onChange={(e) =>
                  onChange({
                    item: { ...draft.item, title: e.target.value },
                  })
                }
                placeholder="Campaign or piece title"
                className="mt-1.5 w-full border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wider text-[#737373]">
                Concept & direction
              </span>
              <textarea
                value={draft.item.direction ?? ""}
                onChange={(e) =>
                  onChange({
                    item: { ...draft.item, direction: e.target.value },
                  })
                }
                rows={5}
                placeholder="Concept, art direction, tools, what you directed vs generated…"
                className="mt-1.5 w-full border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
              />
            </label>

            <label className="flex cursor-pointer items-start gap-3 border border-white/10 bg-[#0a0a0a] px-3 py-3">
              <input
                type="checkbox"
                checked={Boolean(draft.item.hidden)}
                onChange={(e) =>
                  onChange({
                    item: { ...draft.item, hidden: e.target.checked },
                  })
                }
                className="mt-0.5 h-4 w-4 accent-[#ff453a]"
              />
              <span>
                <span className="block text-sm text-white">Hidden</span>
                <span className="mt-0.5 block text-xs text-[#737373]">
                  Keep in the CMS but hide from the homepage rail and /ai
                </span>
              </span>
            </label>

            <div className="block">
              <span className="text-xs uppercase tracking-wider text-[#737373]">
                Media
              </span>
              <FileDropZone
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                disabled={compressing || saving}
                onFile={onProcessMedia}
                className="mt-1.5 p-3"
              >
                <p className="mb-2 text-xs text-[#525252]">
                  Drop a 9×16 image or video, or choose a file
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onProcessMedia(file);
                  }}
                  disabled={compressing || saving}
                  className="block w-full text-sm text-[#a3a3a3] file:mr-4 file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-black hover:file:opacity-90 disabled:opacity-50"
                />
              </FileDropZone>
              {compressing && (
                <p className="mt-1 text-xs text-[#737373]">Processing…</p>
              )}
              {uploadNote && !compressing && (
                <p className="mt-1 text-xs text-[#737373]">{uploadNote}</p>
              )}
              {uploadError && (
                <p className="mt-1 text-xs text-[#ff453a]">{uploadError}</p>
              )}
            </div>

            {draft.media.type === "video" && (
              <div className="block">
                <span className="text-xs uppercase tracking-wider text-[#737373]">
                  Poster (optional)
                </span>
                <FileDropZone
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={compressing || saving}
                  onFile={onProcessPoster}
                  className="mt-1.5 p-3"
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void onProcessPoster(file);
                    }}
                    disabled={compressing || saving}
                    className="block w-full text-sm text-[#a3a3a3] file:mr-4 file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-black hover:file:opacity-90 disabled:opacity-50"
                  />
                </FileDropZone>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
          <div>
            {!draft.isNew && onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                disabled={saving}
                className="text-xs text-[#ff453a] transition-colors hover:text-white disabled:opacity-40"
              >
                Delete piece
              </button>
            ) : (
              <span className="text-xs text-[#525252]">
                {saving ? "Saving…" : dirty ? "Unsaved edits" : "Ready"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={requestClose}
              disabled={saving}
              className="border border-white/15 px-4 py-2 text-xs text-[#a3a3a3] transition-colors hover:border-white/30 hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={!canSave}
              className="bg-white px-4 py-2 text-xs font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving
                ? "Saving…"
                : draft.isNew
                  ? "Add to gallery"
                  : "Save piece"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CreativeShowcaseEditor({
  initialItems,
}: {
  initialItems: CreativeShowcaseItem[];
}) {
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState(initialItems);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const [mediaByItemId, setMediaByItemId] = useState(() =>
    initMediaByItemId(initialItems),
  );
  const [previewByItemId, setPreviewByItemId] = useState<Record<string, string>>(
    {},
  );
  const [modal, setModal] = useState<ModalDraft | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [uploadNote, setUploadNote] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setItems(initialItems);
    itemsRef.current = initialItems;
    setMediaByItemId(initMediaByItemId(initialItems));
  }, [initialItems]);

  const persistItems = useCallback(
    async (nextItems: CreativeShowcaseItem[], successMessage?: string) => {
      setStatus("saving");
      try {
        const result = await saveCreativeShowcaseItems(nextItems);
        if (result && "error" in result) {
          toastError(result.error);
          setStatus("idle");
          return false;
        }
        setStatus("saved");
        if (successMessage && !(result && "unchanged" in result && result.unchanged)) {
          success(successMessage);
        }
        window.setTimeout(() => setStatus("idle"), 1200);
        return true;
      } catch (err) {
        toastError(err instanceof Error ? err.message : "Failed to save");
        setStatus("idle");
        return false;
      }
    },
    [success, toastError],
  );

  const onReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      const previous = itemsRef.current;
      const next = reorderList(previous, fromIndex, toIndex);
      if (next === previous) return;
      itemsRef.current = next;
      setItems(next);
      void persistItems(next, "Order saved");
    },
    [persistItems],
  );

  const drag = useDragReorder(onReorder);

  function openCreate() {
    const item = newItem();
    const draftBase = {
      item,
      media: { src: "", type: "image" as const },
      localSrc: null,
      localPoster: null,
    };
    setUploadNote(null);
    setUploadError(null);
    setModal({
      ...draftBase,
      pendingVideo: null,
      pendingImage: null,
      pendingPoster: null,
      isNew: true,
      baseline: draftSignature(draftBase),
    });
  }

  function openEdit(item: CreativeShowcaseItem) {
    const media = mediaByItemId[item.id] ?? { src: item.src, type: item.type };
    const draftBase = {
      item: { ...item },
      media: { ...media },
      localSrc: previewByItemId[item.id] ?? null,
      localPoster: null,
    };
    setUploadNote(null);
    setUploadError(null);
    setModal({
      ...draftBase,
      pendingVideo: null,
      pendingImage: null,
      pendingPoster: null,
      isNew: false,
      baseline: draftSignature(draftBase),
    });
  }

  function closeModal() {
    if (modal?.localSrc?.startsWith("blob:")) {
      const kept = previewByItemId[modal.item.id];
      if (modal.localSrc !== kept) URL.revokeObjectURL(modal.localSrc);
    }
    if (modal?.localPoster?.startsWith("blob:")) {
      URL.revokeObjectURL(modal.localPoster);
    }
    setModal(null);
    setUploadNote(null);
    setUploadError(null);
    setCompressing(false);
    setSaving(false);
  }

  function patchModal(patch: Partial<ModalDraft>) {
    setModal((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  async function processMediaFile(file: File) {
    if (!modal) return;
    setUploadError(null);
    setUploadNote(null);

    if (file.type.startsWith("video/")) {
      const localSrc = URL.createObjectURL(file);
      if (modal.localSrc?.startsWith("blob:")) URL.revokeObjectURL(modal.localSrc);
      patchModal({
        media: { src: modal.media.src, type: "video" },
        localSrc,
        pendingVideo: file,
        pendingImage: null,
        item: { ...modal.item, type: "video" },
      });
      setUploadNote(`Video ready (${formatBytes(file.size)})`);
      return;
    }

    setCompressing(true);
    try {
      const compressed = await compressImageForUpload(file);
      const localSrc = URL.createObjectURL(compressed);
      if (modal.localSrc?.startsWith("blob:")) URL.revokeObjectURL(modal.localSrc);
      patchModal({
        media: { src: modal.media.src, type: "image" },
        localSrc,
        pendingVideo: null,
        pendingImage: compressed,
        item: { ...modal.item, type: "image" },
      });
      setUploadNote(
        compressed.size < file.size
          ? `Compressed ${formatBytes(file.size)} → ${formatBytes(compressed.size)}`
          : `Ready (${formatBytes(compressed.size)})`,
      );
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Compression failed");
    } finally {
      setCompressing(false);
    }
  }

  async function processPosterFile(file: File) {
    if (!modal) return;
    setCompressing(true);
    try {
      const compressed = await compressImageForUpload(file);
      const localPoster = URL.createObjectURL(compressed);
      if (modal.localPoster?.startsWith("blob:")) {
        URL.revokeObjectURL(modal.localPoster);
      }
      patchModal({ localPoster, pendingPoster: compressed });
    } catch {
      setUploadError("Failed to compress poster image");
    } finally {
      setCompressing(false);
    }
  }

  async function saveModal() {
    if (!modal) return;
    const title = modal.item.title.trim();
    const previewSrc = modal.localSrc ?? modal.media.src;
    if (!title) {
      setUploadError("Title is required");
      return;
    }
    if (!previewSrc && !modal.pendingImage && !modal.pendingVideo) {
      setUploadError("Add media before saving this piece");
      return;
    }

    setSaving(true);
    setUploadError(null);

    try {
      let src =
        modal.media.src && !modal.media.src.startsWith("blob:")
          ? modal.media.src
          : "";
      let type = modal.media.type;
      let poster = modal.item.poster;

      if (modal.pendingVideo) {
        src = await uploadCreativeVideoToBlob(modal.pendingVideo, modal.item.id);
        type = "video";
      } else if (modal.pendingImage) {
        const formData = new FormData();
        formData.set("itemId", modal.item.id);
        formData.set("file", modal.pendingImage);
        const uploaded = await uploadCreativeItemMedia(formData);
        if ("error" in uploaded) throw new Error(uploaded.error);
        src = uploaded.url;
        type = uploaded.type;
      }

      if (modal.pendingPoster) {
        const formData = new FormData();
        formData.set("itemId", modal.item.id);
        formData.set("file", modal.pendingPoster);
        const uploaded = await uploadCreativeItemPoster(formData);
        if ("error" in uploaded) throw new Error(uploaded.error);
        poster = uploaded.url;
      }

      if (!src) throw new Error("Media upload did not return a URL");

      const nextItem: CreativeShowcaseItem = {
        ...modal.item,
        title,
        alt: title,
        type,
        src,
        poster,
        direction: modal.item.direction?.trim() || undefined,
        hidden: Boolean(modal.item.hidden),
      };

      const previous = itemsRef.current;
      const exists = previous.some((item) => item.id === nextItem.id);
      const nextItems = exists
        ? previous.map((item) => (item.id === nextItem.id ? nextItem : item))
        : [...previous, nextItem];

      const ok = await persistItems(
        nextItems,
        modal.isNew ? "Piece added" : "Piece saved",
      );
      if (!ok) {
        setSaving(false);
        return;
      }

      itemsRef.current = nextItems;
      setItems(nextItems);
      setMediaByItemId((prev) => ({
        ...prev,
        [nextItem.id]: { src, type },
      }));
      if (modal.localSrc) {
        setPreviewByItemId((prev) => ({
          ...prev,
          [nextItem.id]: modal.localSrc as string,
        }));
      }
      setModal(null);
      setUploadNote(null);
      setCompressing(false);
      setSaving(false);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to save piece");
      setSaving(false);
    }
  }

  async function deleteFromModal() {
    if (!modal || modal.isNew) return;
    if (!window.confirm(`Delete “${modal.item.title || "this piece"}”?`)) return;

    const id = modal.item.id;
    const previous = itemsRef.current;
    const nextItems = previous.filter((item) => item.id !== id);
    const ok = await persistItems(nextItems, "Piece deleted");
    if (!ok) return;

    itemsRef.current = nextItems;
    setItems(nextItems);
    setMediaByItemId((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setPreviewByItemId((prev) => {
      const next = { ...prev };
      const preview = next[id];
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
      delete next[id];
      return next;
    });
    closeModal();
  }

  async function toggleHidden(item: CreativeShowcaseItem) {
    const previous = itemsRef.current;
    const nextItems = previous.map((entry) =>
      entry.id === item.id ? { ...entry, hidden: !entry.hidden } : entry,
    );
    itemsRef.current = nextItems;
    setItems(nextItems);
    const ok = await persistItems(
      nextItems,
      item.hidden ? "Piece visible" : "Piece hidden",
    );
    if (!ok) {
      itemsRef.current = previous;
      setItems(previous);
    }
  }

  async function duplicateItem(item: CreativeShowcaseItem, index: number) {
    const copy: CreativeShowcaseItem = {
      ...item,
      id: `creative-${crypto.randomUUID().slice(0, 8)}`,
      title: item.title ? `${item.title} (copy)` : "Untitled copy",
    };
    const media = mediaByItemId[item.id] ?? { src: item.src, type: item.type };
    const previous = itemsRef.current;
    const nextItems = [...previous];
    nextItems.splice(index + 1, 0, copy);

    itemsRef.current = nextItems;
    setItems(nextItems);
    setMediaByItemId((prev) => ({ ...prev, [copy.id]: { ...media } }));

    const ok = await persistItems(nextItems, "Piece duplicated");
    if (!ok) {
      itemsRef.current = previous;
      setItems(previous);
      setMediaByItemId((prev) => {
        const next = { ...prev };
        delete next[copy.id];
        return next;
      });
    }
  }

  const hiddenCount = items.filter((item) => item.hidden).length;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#737373]">
            Gallery
          </p>
          <p className="mt-1 text-xs text-[#525252]">
            {items.length === 0
              ? "No pieces yet"
              : `${items.length} piece${items.length === 1 ? "" : "s"} · ${hiddenCount} hidden · autosaves`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-[10px] uppercase tracking-wider text-[#525252]">
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : ""}
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="flex h-9 w-9 items-center justify-center border border-white/15 text-white transition-colors hover:border-[#ff453a] hover:text-[#ff453a]"
            aria-label="Add piece"
            title="Add piece"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M8 3v10M3 8h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <button
          type="button"
          onClick={openCreate}
          className="flex w-full flex-col items-center justify-center gap-3 border border-dashed border-white/15 px-6 py-16 text-center transition-colors hover:border-[#ff453a]/40"
        >
          <span className="flex h-10 w-10 items-center justify-center border border-white/15 text-white">
            +
          </span>
          <span className="text-sm text-[#a3a3a3]">Add your first 9×16 piece</span>
        </button>
      ) : (
        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
          role="list"
        >
          {items.map((item, index) => {
            const media = mediaByItemId[item.id] ?? {
              src: item.src,
              type: item.type,
            };
            const thumbSrc = previewByItemId[item.id] || media.src || item.src;
            return (
              <div
                key={item.id}
                role="listitem"
                className={drag.getRowClassName(
                  index,
                  `group relative overflow-hidden border border-white/10 bg-[#0a0a0a] ${item.hidden ? "opacity-55" : ""}`,
                )}
                onDragOver={(event) => drag.handleDragOver(index, event)}
                onDragLeave={drag.handleDragLeave}
                onDrop={(event) => drag.handleDrop(index, event)}
              >
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="block w-full text-left"
                  aria-label={`Edit ${item.title || `piece ${index + 1}`}`}
                >
                  <div className="relative aspect-[9/16]">
                    <ThumbMedia
                      src={thumbSrc}
                      type={media.type}
                      poster={item.poster}
                      alt={item.alt || item.title}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-90" />
                    <div className="absolute inset-x-0 bottom-0 p-2.5">
                      <p className="truncate text-xs font-medium text-white">
                        {item.title || "Untitled"}
                      </p>
                      {item.direction ? (
                        <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-[#a3a3a3]">
                          {item.direction}
                        </p>
                      ) : null}
                    </div>
                    <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        {media.type === "video" && (
                          <span className="bg-black/70 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white">
                            Video
                          </span>
                        )}
                        <span className="bg-black/70 px-1.5 py-0.5 text-[9px] tabular-nums text-[#a3a3a3]">
                          {index + 1}
                        </span>
                      </div>
                      {item.hidden && (
                        <span className="bg-black/80 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#ff453a]">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                <div className="absolute left-2 top-2 z-[1] rounded bg-black/70 p-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  <DragHandle
                    index={index}
                    onDragStart={drag.handleDragStart}
                    onDragEnd={drag.handleDragEnd}
                  />
                </div>

                <div className="absolute bottom-2 right-2 z-[1] flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      void toggleHidden(item);
                    }}
                    className="rounded bg-black/70 px-1.5 py-1 text-[9px] uppercase tracking-wider text-[#a3a3a3] hover:text-white"
                    title={item.hidden ? "Show on site" : "Hide from site"}
                  >
                    {item.hidden ? "Show" : "Hide"}
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      void duplicateItem(item, index);
                    }}
                    className="rounded bg-black/70 px-1.5 py-1 text-[9px] uppercase tracking-wider text-[#a3a3a3] hover:text-white"
                    title="Duplicate"
                  >
                    Dup
                  </button>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={openCreate}
            className="flex aspect-[9/16] flex-col items-center justify-center gap-2 border border-dashed border-white/15 text-[#525252] transition-colors hover:border-[#ff453a]/50 hover:text-[#a3a3a3]"
            aria-label="Add piece"
          >
            <span className="text-2xl leading-none">+</span>
            <span className="text-[10px] uppercase tracking-wider">Add</span>
          </button>
        </div>
      )}

      <p className="text-xs text-[#525252]">
        Edits, hide/show, and drag-reorder save automatically.
      </p>

      {modal && (
        <PieceModal
          draft={modal}
          onChange={patchModal}
          onClose={closeModal}
          onSave={() => void saveModal()}
          onDelete={modal.isNew ? undefined : () => void deleteFromModal()}
          compressing={compressing}
          saving={saving}
          uploadNote={uploadNote}
          uploadError={uploadError}
          onProcessMedia={processMediaFile}
          onProcessPoster={processPosterFile}
        />
      )}
    </div>
  );
}
