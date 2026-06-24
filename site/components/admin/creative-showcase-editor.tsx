"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
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
  SortableDropRow,
  useDragReorder,
} from "@/components/admin/drag-reorder";

export type CreativeShowcaseEditorHandle = {
  uploadPendingVideos: (form: HTMLFormElement) => Promise<void>;
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

function MediaPreview({
  item,
  localSrc,
  mediaType,
}: {
  item: CreativeShowcaseItem;
  localSrc: string | null;
  mediaType: "image" | "video";
}) {
  const src = localSrc ?? item.src;
  if (!src) {
    return (
      <div className="flex aspect-[9/16] w-full max-w-[180px] items-center justify-center border border-dashed border-white/15 bg-[#0a0a0a] text-xs text-[#525252]">
        No media
      </div>
    );
  }

  if (mediaType === "video") {
    return (
      <video
        src={src}
        poster={item.poster}
        className="aspect-[9/16] w-full max-w-[180px] object-cover border border-white/10"
        muted
        playsInline
        loop
        autoPlay
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="aspect-[9/16] w-full max-w-[180px] object-cover border border-white/10"
    />
  );
}

type ItemMedia = { src: string; type: "image" | "video" };

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

function CreativeItemFields({
  item,
  index,
  media,
  onMediaChange,
  onRemove,
  drag,
  onPendingVideo,
}: {
  item: CreativeShowcaseItem;
  index: number;
  media: ItemMedia;
  onMediaChange: (itemId: string, patch: Partial<ItemMedia>) => void;
  onRemove: () => void;
  drag: ReturnType<typeof useDragReorder>;
  onPendingVideo: (itemId: string, file: File | null) => void;
}) {
  const mediaRef = useRef<HTMLInputElement>(null);
  const posterRef = useRef<HTMLInputElement>(null);
  const pendingVideoRef = useRef<File | null>(null);
  const [localMedia, setLocalMedia] = useState<string | null>(null);
  const [localPoster, setLocalPoster] = useState<string | null>(null);
  const [uploadNote, setUploadNote] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const prefix = `item_${index}_`;

  useEffect(() => {
    return () => {
      if (localMedia?.startsWith("blob:")) URL.revokeObjectURL(localMedia);
      if (localPoster) URL.revokeObjectURL(localPoster);
    };
  }, [localMedia, localPoster]);

  async function onMediaFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadNote(null);

    if (file.type.startsWith("video/")) {
      onMediaChange(item.id, { type: "video" });
      pendingVideoRef.current = file;
      onPendingVideo(item.id, file);
      if (localMedia?.startsWith("blob:")) URL.revokeObjectURL(localMedia);
      setLocalMedia(URL.createObjectURL(file));
      setUploadNote(`Video ready (${formatBytes(file.size)}) — uploads when you save`);
      notifyFormChanged(mediaRef.current);
      return;
    }

    pendingVideoRef.current = null;
    onPendingVideo(item.id, null);

    setCompressing(true);
    try {
      const compressed = await compressImageForUpload(file);
      if (mediaRef.current) {
        const transfer = new DataTransfer();
        transfer.items.add(compressed);
        mediaRef.current.files = transfer.files;
      }
      onMediaChange(item.id, { type: "image" });
      if (localMedia?.startsWith("blob:")) URL.revokeObjectURL(localMedia);
      setLocalMedia(URL.createObjectURL(compressed));
      setUploadNote(
        compressed.size < file.size
          ? `Compressed ${formatBytes(file.size)} → ${formatBytes(compressed.size)}`
          : `Ready (${formatBytes(compressed.size)})`,
      );
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Compression failed");
      e.target.value = "";
    } finally {
      setCompressing(false);
    }
  }

  async function onPosterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressing(true);
    try {
      const compressed = await compressImageForUpload(file);
      if (posterRef.current) {
        const transfer = new DataTransfer();
        transfer.items.add(compressed);
        posterRef.current.files = transfer.files;
      }
      if (localPoster) URL.revokeObjectURL(localPoster);
      setLocalPoster(URL.createObjectURL(compressed));
    } catch {
      setUploadError("Failed to compress poster image");
    } finally {
      setCompressing(false);
    }
  }

  function handleRemove() {
    pendingVideoRef.current = null;
    onPendingVideo(item.id, null);
    onRemove();
  }

  return (
    <SortableDropRow
      index={index}
      drag={drag}
      className="border border-white/10 bg-[#050505] p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <DragHandle
            index={index}
            onDragStart={drag.handleDragStart}
            onDragEnd={drag.handleDragEnd}
          />
          <p className="text-xs uppercase tracking-wider text-[#737373]">
            Piece {index + 1}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="text-xs text-[#ff453a] hover:text-white"
        >
          Remove
        </button>
      </div>

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
      <input type="hidden" name={`${prefix}poster`} value={item.poster ?? ""} />

      <div className="mt-4 grid gap-6 lg:grid-cols-[180px_1fr]">
        <MediaPreview
          item={{ ...item, src: media.src }}
          localSrc={localMedia}
          mediaType={media.type}
        />

        <div className="grid gap-4">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-[#737373]">
              Title
            </span>
            <input
              name={`${prefix}title`}
              defaultValue={item.title}
              placeholder="Campaign name or piece title"
              className="mt-1.5 w-full border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-[#737373]">
              Concept & direction
            </span>
            <textarea
              name={`${prefix}direction`}
              defaultValue={item.direction ?? ""}
              rows={4}
              placeholder="Brief: concept, art direction, tools (Runway, fal.ai, shoot), channel, what you directed vs generated…"
              className="mt-1.5 w-full border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-[#737373]">
              Media upload
            </span>
            <input
              ref={mediaRef}
              type="file"
              name={media.type === "image" ? `${prefix}media` : undefined}
              data-creative-media={item.id}
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
              onChange={onMediaFileChange}
              disabled={compressing}
              className="mt-1.5 block w-full text-sm text-[#a3a3a3] file:mr-4 file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-black hover:file:opacity-90 disabled:opacity-50"
            />
            {compressing && (
              <p className="mt-1 text-xs text-[#737373]">Processing…</p>
            )}
            {uploadNote && !compressing && (
              <p className="mt-1 text-xs text-[#737373]">{uploadNote}</p>
            )}
            {uploadError && (
              <p className="mt-1 text-xs text-[#ff453a]">{uploadError}</p>
            )}
            <p className="mt-1 text-xs text-[#525252]">
              9×16 image or video. Images compress to WebP; videos upload when
              you save (up to 80MB).
            </p>
          </label>

          {media.type === "video" && (
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-[#737373]">
                Video poster (optional)
              </span>
              <input
                ref={posterRef}
                type="file"
                name={`${prefix}posterFile`}
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={onPosterChange}
                disabled={compressing}
                className="mt-1.5 block w-full text-sm text-[#a3a3a3] file:mr-4 file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-black hover:file:opacity-90 disabled:opacity-50"
              />
              {localPoster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={localPoster}
                  alt=""
                  className="mt-2 aspect-[9/16] w-20 object-cover border border-white/10"
                />
              )}
            </label>
          )}
        </div>
      </div>
    </SortableDropRow>
  );
}

export const CreativeShowcaseEditor = forwardRef<
  CreativeShowcaseEditorHandle,
  { initialItems: CreativeShowcaseItem[] }
>(function CreativeShowcaseEditor({ initialItems }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingVideosRef = useRef(new Map<string, File>());
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

  const updateMedia = useCallback((itemId: string, patch: Partial<ItemMedia>) => {
    setMediaByItemId((prev) => {
      const current = prev[itemId] ?? { src: "", type: "image" as const };
      const next = { ...prev, [itemId]: { ...current, ...patch } };
      mediaByItemIdRef.current = next;
      return next;
    });
  }, []);

  const setPendingVideo = useCallback((itemId: string, file: File | null) => {
    if (file) pendingVideosRef.current.set(itemId, file);
    else pendingVideosRef.current.delete(itemId);
  }, []);

  useImperativeHandle(ref, () => ({
    async uploadPendingVideos(form: HTMLFormElement) {
      syncMediaFieldsToForm(form, itemsRef.current, mediaByItemIdRef.current);

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
    setItems((prev) => reorderList(prev, fromIndex, toIndex));
  }, []);

  const drag = useDragReorder(onReorder);

  const skipDirtyNotify = useRef(true);
  useEffect(() => {
    if (skipDirtyNotify.current) {
      skipDirtyNotify.current = false;
      return;
    }
    notifyFormChanged(containerRef.current);
  }, [items]);

  function addItem() {
    const item = newItem();
    setItems((prev) => [...prev, item]);
    setMediaByItemId((prev) => {
      const next = { ...prev, [item.id]: { src: "", type: "image" as const } };
      mediaByItemIdRef.current = next;
      return next;
    });
  }

  function removeItem(index: number) {
    const item = items[index];
    if (item) {
      pendingVideosRef.current.delete(item.id);
      setMediaByItemId((prev) => {
        const next = { ...prev };
        delete next[item.id];
        mediaByItemIdRef.current = next;
        return next;
      });
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div ref={containerRef} className="space-y-4">
      <input type="hidden" name="itemCount" value={items.length} />

      {items.length > 0 && (
        <p className="text-xs text-[#525252]">Drag pieces to reorder the homepage rail.</p>
      )}

      {items.length === 0 && (
        <p className="text-sm text-[#737373]">
          No pieces yet — add your first 9×16 image or video.
        </p>
      )}

      {items.map((item, index) => (
        <CreativeItemFields
          key={item.id}
          item={item}
          index={index}
          media={mediaByItemId[item.id] ?? { src: item.src, type: item.type }}
          onMediaChange={updateMedia}
          onRemove={() => removeItem(index)}
          drag={drag}
          onPendingVideo={setPendingVideo}
        />
      ))}

      <button
        type="button"
        onClick={addItem}
        className="border border-dashed border-white/20 px-4 py-3 text-sm text-[#a3a3a3] transition-colors hover:border-[#ff453a] hover:text-white"
      >
        + Add piece
      </button>
    </div>
  );
});
