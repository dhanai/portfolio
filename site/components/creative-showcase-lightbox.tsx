"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CreativeShowcaseItem } from "@/lib/defaults/creative-showcase";

export function CreativeShowcaseLightbox({
  items,
  index,
  onClose,
  onChangeIndex,
}: {
  items: CreativeShowcaseItem[];
  index: number;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}) {
  const item = items[index];
  const titleId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) {
      document.body.style.paddingRight = `${scrollbar}px`;
    }
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, []);

  useEffect(() => {
    setMuted(false);
  }, [index]);

  useEffect(() => {
    if (!item || item.type !== "video") return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = muted;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      video.pause();
      return;
    }

    void video.play().catch(() => {});
  }, [item, muted, index]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onChangeIndex((index + 1) % items.length);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onChangeIndex((index - 1 + items.length) % items.length);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, items.length, onChangeIndex, onClose]);

  if (!item) return null;

  const hasPrevNext = items.length > 1;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/85 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex min-h-full items-start justify-center px-4 py-4 sm:px-8 sm:py-10 md:items-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative my-auto grid w-full max-w-5xl gap-5 pb-8 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] md:items-end md:gap-8 md:pb-0"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="sticky top-0 z-20 ml-auto flex h-10 w-10 items-center justify-center text-[#a3a3a3] transition-colors hover:text-white md:absolute md:-top-2 md:-right-2 md:ml-0"
            aria-label="Close"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="relative mx-auto flex w-full max-w-[min(100%,380px)] justify-center">
            <div className="aspect-[9/16] h-[min(62dvh,560px)] max-h-[62dvh] max-w-full overflow-hidden border border-white/10 bg-[#0a0a0a]">
              {item.type === "video" ? (
                <video
                  key={item.id}
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  src={item.src}
                  poster={item.poster}
                  controls
                  playsInline
                  loop
                  autoPlay
                  muted={muted}
                  preload="auto"
                  aria-label={item.alt}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {item.type === "video" && (
              <button
                type="button"
                onClick={() => setMuted((value) => !value)}
                className="absolute bottom-3 left-3 border border-white/15 bg-black/70 px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-white transition-colors hover:border-white/40"
              >
                {muted ? "Unmute" : "Mute"}
              </button>
            )}
          </div>

          <div className="min-w-0 md:pb-2">
            <p className="label-caps text-[#737373]">
              {index + 1} / {items.length}
            </p>
            <h2
              id={titleId}
              className="mt-3 font-display text-2xl font-medium tracking-tight text-white md:text-3xl"
            >
              {item.title || "Untitled"}
            </h2>
            {item.direction || item.caption ? (
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#a3a3a3]">
                {item.direction || item.caption}
              </p>
            ) : null}

            {hasPrevNext && (
              <div className="mt-6 flex items-center gap-3 sm:mt-8">
                <button
                  type="button"
                  onClick={() =>
                    onChangeIndex((index - 1 + items.length) % items.length)
                  }
                  className="border border-white/15 px-3 py-2 text-xs text-[#a3a3a3] transition-colors hover:border-white/40 hover:text-white"
                  aria-label="Previous piece"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={() => onChangeIndex((index + 1) % items.length)}
                  className="border border-white/15 px-3 py-2 text-xs text-[#a3a3a3] transition-colors hover:border-white/40 hover:text-white"
                  aria-label="Next piece"
                >
                  Next →
                </button>
              </div>
            )}

            <p className="mt-5 hidden text-[10px] uppercase tracking-wider text-[#525252] sm:block">
              Esc to close · arrows to browse
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
