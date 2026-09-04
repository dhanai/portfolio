"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { CreativeShowcaseItem } from "@/lib/defaults/creative-showcase";
import { compressImageForUpload } from "@/lib/admin/compress-image-client";
import { uploadCreativeVideoToBlob } from "@/lib/admin/upload-creative-blob-client";
import { notifyFormChanged, reorderList } from "@/lib/admin/reorder-list";
import {
  DragHandle,
  useDragReorder,
} from "@/components/admin/drag-reorder";
import {
  assignFileToInput,
  FileDropZone,
} from "@/components/admin/file-drop-zone";

export type CreativeShowcaseEditorHandle = {
  uploadPendingVideos: (form: HTMLFormElement) => Promise<void>;
};

type ItemMedia = { src: string; type: "image" | "video" };

type ModalDraft = {
  item: CreativeShowcaseItem;
  media: ItemMedia;
  localSrc: string | null;
  localPoster: string | null;
  pendingVideo: File | null;
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
  };
}

function draftSignature(draft: Omit<ModalDraft, "baseline" | "isNew" | "pendingVideo">) {
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

function syncMediaFieldsToForm(
  form: HTMLFormElement,
  items: CreativeShowcaseItem[],
  mediaByItemId: Record<string, ItemMedia>,
) {
  for (const item of items) {
    const media = mediaByItemId[item.id] ?? { src: item.src, type: item.type };
    const srcInput = form.querySelector<HTMLInputElement>(
      `[data-creative-src="${item.id}"]`,
    );
    const typeInput = form.querySelector<HTMLInputElement>(
      `[data-creative-type="${item.id}"]`,
    );
    if (srcInput) srcInput.value = media.src;
    if (typeInput) typeInput.value = media.type;
  }
}

function syncTextFieldsToForm(
  form: HTMLFormElement,
  items: CreativeShowcaseItem[],
) {
  items.forEach((item, index) => {
    const titleInput = form.querySelector<HTMLInputElement>(
      `[name="item_${index}_title"]`,
    );
    const directionInput = form.querySelector<HTMLTextAreaElement>(
      `[name="item_${index}_direction"]`,
    );
    if (titleInput) titleInput.value = item.title;
    if (directionInput) directionInput.value = item.direction ?? "";
  });
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
  uploadNote,
  uploadError,
  onProcessMedia,
  onProcessPoster,
  mediaInputRef,
  posterInputRef,
}: {
  draft: ModalDraft;
  onChange: (patch: Partial<ModalDraft>) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
  compressing: boolean;
  uploadNote: string | null;
  uploadError: string | null;
  onProcessMedia: (file: File) => Promise<void>;
  onProcessPoster: (file: File) => Promise<void>;
  mediaInputRef: React.RefObject<HTMLInputElement | null>;
  posterInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const titleId = useId();
  const titleRef = useRef<HTMLInputElement>(null);
  const previewSrc = draft.localSrc ?? draft.media.src;
  const dirty = draftSignature(draft) !== draft.baseline;
  const canSave =
    draft.item.title.trim().length > 0 &&
    Boolean(previewSrc) &&
    !compressing;

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
              9×16 still or video for the homepage rail and /ai
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
            {draft.media.type === "video" && previewSrc ? (
              <p className="text-[10px] uppercase tracking-wider text-[#525252]">
                Video
              </p>
            ) : null}
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

            <div className="block">
              <span className="text-xs uppercase tracking-wider text-[#737373]">
                Media
              </span>
              <FileDropZone
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                disabled={compressing}
                onFile={onProcessMedia}
                className="mt-1.5 p-3"
              >
                <p className="mb-2 text-xs text-[#525252]">
                  Drop a 9×16 image or video, or choose a file
                </p>
                <input
                  ref={mediaInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onProcessMedia(file);
                  }}
                  disabled={compressing}
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
                  disabled={compressing}
                  onFile={onProcessPoster}
                  className="mt-1.5 p-3"
                >
                  <input
                    ref={posterInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void onProcessPoster(file);
                    }}
                    disabled={compressing}
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
                className="text-xs text-[#ff453a] transition-colors hover:text-white"
              >
                Delete piece
              </button>
            ) : (
              <span className="text-xs text-[#525252]">
                {dirty ? "Unsaved edits" : "Ready"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={requestClose}
              className="border border-white/15 px-4 py-2 text-xs text-[#a3a3a3] transition-colors hover:border-white/30 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={!canSave}
              className="bg-white px-4 py-2 text-xs font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {draft.isNew ? "Add to gallery" : "Save piece"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const CreativeShowcaseEditor = forwardRef<
  CreativeShowcaseEditorHandle,
  { initialItems: CreativeShowcaseItem[] }
>(function CreativeShowcaseEditor({ initialItems }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingVideosRef = useRef(new Map<string, File>());
  const mediaFileByIdRef = useRef(new Map<string, File>());
  const posterFileByIdRef = useRef(new Map<string, File>());
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<CreativeShowcaseItem[]>(
    initialItems.length > 0 ? initialItems : [],
  );
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const [mediaByItemId, setMediaByItemId] = useState<Record<string, ItemMedia>>(
    () => initMediaByItemId(initialItems),
  );
  const mediaByItemIdRef = useRef(mediaByItemId);
  mediaByItemIdRef.current = mediaByItemId;

  const [modal, setModal] = useState<ModalDraft | null>(null);
  const [previewByItemId, setPreviewByItemId] = useState<Record<string, string>>(
    {},
  );
  const [compressing, setCompressing] = useState(false);
  const [uploadNote, setUploadNote] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveHint, setSaveHint] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    async uploadPendingVideos(form: HTMLFormElement) {
      syncTextFieldsToForm(form, itemsRef.current);
      syncMediaFieldsToForm(form, itemsRef.current, mediaByItemIdRef.current);

      // Attach any pending image/poster files by item id onto indexed inputs
      itemsRef.current.forEach((item, index) => {
        const mediaFile = mediaFileByIdRef.current.get(item.id);
        const mediaInput = form.querySelector<HTMLInputElement>(
          `[data-creative-media="${item.id}"]`,
        );
        if (mediaFile && mediaInput && mediaByItemIdRef.current[item.id]?.type === "image") {
          assignFileToInput(mediaInput, mediaFile);
          mediaInput.name = `item_${index}_media`;
        }

        const posterFile = posterFileByIdRef.current.get(item.id);
        const posterInput = form.querySelector<HTMLInputElement>(
          `[data-creative-poster-file="${item.id}"]`,
        );
        if (posterFile && posterInput) {
          assignFileToInput(posterInput, posterFile);
          posterInput.name = `item_${index}_posterFile`;
        }
      });

      const pending = [...pendingVideosRef.current.entries()];
      if (pending.length === 0) return;

      for (const [itemId, file] of pending) {
        const mediaInput = form.querySelector<HTMLInputElement>(
          `[data-creative-media="${itemId}"]`,
        );

        try {
          const url = await uploadCreativeVideoToBlob(file, itemId);
          const nextMedia: ItemMedia = { src: url, type: "video" };
          mediaByItemIdRef.current = {
            ...mediaByItemIdRef.current,
            [itemId]: nextMedia,
          };
          setMediaByItemId((prev) => ({ ...prev, [itemId]: nextMedia }));
          syncMediaFieldsToForm(form, itemsRef.current, mediaByItemIdRef.current);
          pendingVideosRef.current.delete(itemId);
        } catch (err) {
          if (process.env.NODE_ENV === "development" && mediaInput) {
            const transfer = new DataTransfer();
            transfer.items.add(file);
            mediaInput.files = transfer.files;
            const srcInput = form.querySelector<HTMLInputElement>(
              `[data-creative-src="${itemId}"]`,
            );
            mediaInput.name = srcInput?.name.replace(/src$/, "media") ?? "";
            pendingVideosRef.current.delete(itemId);
            continue;
          }
          throw err;
        }
      }
    },
  }));

  const onReorder = useCallback((fromIndex: number, toIndex: number) => {
    setItems((prev) => {
      const next = reorderList(prev, fromIndex, toIndex);
      itemsRef.current = next;
      return next;
    });
  }, []);

  const drag = useDragReorder(onReorder);

  const skipDirtyNotify = useRef(true);
  useEffect(() => {
    if (skipDirtyNotify.current) {
      skipDirtyNotify.current = false;
      return;
    }
    notifyFormChanged(containerRef.current);
  }, [items, mediaByItemId]);

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
      pendingVideo: pendingVideosRef.current.get(item.id) ?? null,
      isNew: false,
      baseline: draftSignature(draftBase),
    });
  }

  function closeModal() {
    if (modal?.localSrc?.startsWith("blob:")) {
      const keptPreview = previewByItemId[modal.item.id];
      if (modal.localSrc !== keptPreview) {
        URL.revokeObjectURL(modal.localSrc);
      }
    }
    if (modal?.localPoster?.startsWith("blob:")) {
      URL.revokeObjectURL(modal.localPoster);
    }
    setModal(null);
    setUploadNote(null);
    setUploadError(null);
    setCompressing(false);
  }

  function patchModal(patch: Partial<ModalDraft>) {
    setModal((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  async function processMediaFile(file: File) {
    if (!modal) return;
    setUploadError(null);
    setUploadNote(null);

    if (file.type.startsWith("video/")) {
      mediaFileByIdRef.current.delete(modal.item.id);
      const localSrc = URL.createObjectURL(file);
      if (modal.localSrc?.startsWith("blob:")) URL.revokeObjectURL(modal.localSrc);
      patchModal({
        media: { src: modal.media.src, type: "video" },
        localSrc,
        pendingVideo: file,
        item: { ...modal.item, type: "video" },
      });
      setUploadNote(
        `Video ready (${formatBytes(file.size)}) — uploads when you save the page`,
      );
      return;
    }

    setCompressing(true);
    try {
      const compressed = await compressImageForUpload(file);
      assignFileToInput(mediaInputRef.current, compressed);
      mediaFileByIdRef.current.set(modal.item.id, compressed);
      const localSrc = URL.createObjectURL(compressed);
      if (modal.localSrc?.startsWith("blob:")) URL.revokeObjectURL(modal.localSrc);
      // Keep remote src if present; blob preview is local-only until page save uploads.
      patchModal({
        media: { src: modal.media.src, type: "image" },
        localSrc,
        pendingVideo: null,
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
      assignFileToInput(posterInputRef.current, compressed);
      posterFileByIdRef.current.set(modal.item.id, compressed);
      const localPoster = URL.createObjectURL(compressed);
      if (modal.localPoster?.startsWith("blob:")) {
        URL.revokeObjectURL(modal.localPoster);
      }
      patchModal({ localPoster });
    } catch {
      setUploadError("Failed to compress poster image");
    } finally {
      setCompressing(false);
    }
  }

  function saveModal() {
    if (!modal) return;
    const title = modal.item.title.trim();
    const previewSrc = modal.localSrc ?? modal.media.src;
    const hasPendingImage = mediaFileByIdRef.current.has(modal.item.id);
    const hasPendingVideo = Boolean(modal.pendingVideo);
    if (!title) {
      setSaveHint("Title is required");
      return;
    }
    if (!previewSrc && !hasPendingImage && !hasPendingVideo) {
      setSaveHint("Add media before saving this piece");
      return;
    }
    setSaveHint(null);

    const persistedSrc =
      modal.media.src && !modal.media.src.startsWith("blob:")
        ? modal.media.src
        : "";

    const nextItem: CreativeShowcaseItem = {
      ...modal.item,
      title,
      alt: title,
      type: modal.media.type,
      src: persistedSrc,
      direction: modal.item.direction?.trim() || undefined,
    };

    if (modal.pendingVideo) {
      pendingVideosRef.current.set(modal.item.id, modal.pendingVideo);
    } else if (modal.media.type === "image") {
      pendingVideosRef.current.delete(modal.item.id);
    }

    if (modal.localSrc) {
      setPreviewByItemId((prev) => ({
        ...prev,
        [modal.item.id]: modal.localSrc as string,
      }));
    }

    setMediaByItemId((prev) => {
      const next = {
        ...prev,
        [modal.item.id]: {
          src: persistedSrc,
          type: modal.media.type,
        },
      };
      mediaByItemIdRef.current = next;
      return next;
    });

    setItems((prev) => {
      const exists = prev.some((item) => item.id === modal.item.id);
      const next = exists
        ? prev.map((item) => (item.id === modal.item.id ? nextItem : item))
        : [...prev, nextItem];
      itemsRef.current = next;
      return next;
    });

    // Don't revoke localSrc on close — grid still needs the preview blob.
    setModal(null);
    setUploadNote(null);
    setUploadError(null);
    setCompressing(false);
  }

  function deleteFromModal() {
    if (!modal || modal.isNew) return;
    if (!window.confirm(`Delete “${modal.item.title || "this piece"}”?`)) return;

    const id = modal.item.id;
    pendingVideosRef.current.delete(id);
    mediaFileByIdRef.current.delete(id);
    posterFileByIdRef.current.delete(id);
    setPreviewByItemId((prev) => {
      const next = { ...prev };
      const preview = next[id];
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
      delete next[id];
      return next;
    });
    setMediaByItemId((prev) => {
      const next = { ...prev };
      delete next[id];
      mediaByItemIdRef.current = next;
      return next;
    });
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      itemsRef.current = next;
      return next;
    });
    closeModal();
  }

  function duplicateItem(item: CreativeShowcaseItem, index: number) {
    const copy = {
      ...item,
      id: `creative-${crypto.randomUUID().slice(0, 8)}`,
      title: item.title ? `${item.title} (copy)` : "Untitled copy",
    };
    const media = mediaByItemId[item.id] ?? { src: item.src, type: item.type };
    setMediaByItemId((prev) => {
      const next = { ...prev, [copy.id]: { ...media } };
      mediaByItemIdRef.current = next;
      return next;
    });
    setItems((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      itemsRef.current = next;
      return next;
    });
  }

  return (
    <div ref={containerRef} className="space-y-4">
      <input type="hidden" name="itemCount" value={items.length} />

      {/* Persist fields for form submit */}
      {items.map((item, index) => {
        const media = mediaByItemId[item.id] ?? { src: item.src, type: item.type };
        const prefix = `item_${index}_`;
        return (
          <div key={`fields-${item.id}`} className="hidden" aria-hidden>
            <input type="hidden" name={`${prefix}id`} value={item.id} />
            <input
              type="hidden"
              name={`${prefix}type`}
              value={media.type}
              data-creative-type={item.id}
            />
            <input
              type="hidden"
              name={`${prefix}src`}
              value={media.src}
              data-creative-src={item.id}
            />
            <input
              type="hidden"
              name={`${prefix}poster`}
              value={item.poster ?? ""}
            />
            <input type="hidden" name={`${prefix}title`} value={item.title} />
            <input
              type="hidden"
              name={`${prefix}direction`}
              value={item.direction ?? ""}
            />
            <input
              type="file"
              data-creative-media={item.id}
              className="hidden"
              tabIndex={-1}
            />
            <input
              type="file"
              data-creative-poster-file={item.id}
              className="hidden"
              tabIndex={-1}
            />
          </div>
        );
      })}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#737373]">
            Gallery
          </p>
          <p className="mt-1 text-xs text-[#525252]">
            {items.length === 0
              ? "No pieces yet"
              : `${items.length} piece${items.length === 1 ? "" : "s"} · drag to reorder`}
          </p>
        </div>
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

      {saveHint && <p className="text-xs text-[#ff453a]">{saveHint}</p>}

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
          <span className="max-w-xs text-xs text-[#525252]">
            Stills and videos show on the homepage rail and /ai
          </span>
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
                  "group relative overflow-hidden border border-white/10 bg-[#0a0a0a]",
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
                    {media.type === "video" && (
                      <span className="absolute left-2 top-8 bg-black/70 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white">
                        Video
                      </span>
                    )}
                    <span className="absolute right-2 top-2 bg-black/70 px-1.5 py-0.5 text-[9px] tabular-nums text-[#a3a3a3]">
                      {index + 1}
                    </span>
                  </div>
                </button>

                <div className="absolute left-2 top-2 z-[1] rounded bg-black/70 p-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  <DragHandle
                    index={index}
                    onDragStart={drag.handleDragStart}
                    onDragEnd={drag.handleDragEnd}
                  />
                </div>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    duplicateItem(item, index);
                  }}
                  className="absolute bottom-2 right-2 z-[1] rounded bg-black/70 px-1.5 py-1 text-[9px] uppercase tracking-wider text-[#a3a3a3] opacity-0 transition-opacity hover:text-white group-hover:opacity-100 group-focus-within:opacity-100"
                  title="Duplicate"
                >
                  Dup
                </button>
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
        Click a piece to edit. Drag the handle to reorder. Use Save at the bottom
        of the page to publish.
      </p>

      {modal && (
        <PieceModal
          draft={modal}
          onChange={patchModal}
          onClose={closeModal}
          onSave={saveModal}
          onDelete={modal.isNew ? undefined : deleteFromModal}
          compressing={compressing}
          uploadNote={uploadNote}
          uploadError={uploadError}
          onProcessMedia={processMediaFile}
          onProcessPoster={processPosterFile}
          mediaInputRef={mediaInputRef}
          posterInputRef={posterInputRef}
        />
      )}
    </div>
  );
});
