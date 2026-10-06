"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { CreativeShowcaseItem } from "@/lib/defaults/creative-showcase";

const HOVER_DELAY_MS = 200;

export function CreativeShowcaseCard({
  item,
  className = "",
  onOpen,
  href,
}: {
  item: CreativeShowcaseItem;
  className?: string;
  /** When set, the card is clickable and opens a full view. */
  onOpen?: () => void;
  /** Deep link to this piece (e.g. /ai?v=id). Used with onOpen for shareable URLs. */
  href?: string;
}) {
  const hoverTimer = useRef<number | null>(null);
  const [canPreview, setCanPreview] = useState(false);
  const [hoverPlay, setHoverPlay] = useState(false);

  useEffect(() => {
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCanPreview(hover.matches && !reduce.matches);
    update();
    hover.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      hover.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    };
  }, []);

  function startPreview() {
    if (!canPreview || item.type !== "video") return;
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setHoverPlay(true), HOVER_DELAY_MS);
  }

  function stopPreview() {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    setHoverPlay(false);
  }

  const preview =
    item.type === "video"
      ? { onMouseEnter: startPreview, onMouseLeave: stopPreview }
      : {};

  const media = (
    <>
      {item.type === "video" ? (
        item.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.poster}
            alt={item.alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.alt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />
      )}

      {hoverPlay && item.type === "video" ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={item.src}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          aria-hidden="true"
        />
      ) : null}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80"
        aria-hidden="true"
      />

      {(item.title || item.direction) && (
        <div className="absolute inset-x-0 bottom-0 z-[1] p-4">
          {item.title ? (
            <p className="text-sm font-medium leading-snug text-[#f5f5f5]">
              {item.title}
            </p>
          ) : null}
          {item.direction ? (
            <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-[#a3a3a3]">
              {item.direction}
            </p>
          ) : item.caption ? (
            <p className="mt-1.5 text-xs leading-snug text-[#a3a3a3]">
              {item.caption}
            </p>
          ) : null}
        </div>
      )}

      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-px scale-y-0 bg-[var(--card-accent)] transition-transform duration-500 group-hover:scale-y-100"
        aria-hidden="true"
      />
    </>
  );

  const shellClass = `creative-showcase-card group relative aspect-[9/16] overflow-hidden border border-border bg-[#0a0a0a] ${className}`;
  const shellStyle = { "--card-accent": "#0A84FF" } as CSSProperties;

  if (onOpen) {
    if (href) {
      return (
        <a
          href={href}
          {...preview}
          onClick={(event) => {
            if (
              event.defaultPrevented ||
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            ) {
              return;
            }
            event.preventDefault();
            onOpen();
          }}
          className={`${shellClass} block w-full cursor-zoom-in text-left`}
          style={shellStyle}
          aria-label={`Open ${item.title || item.alt || "piece"}`}
        >
          {media}
        </a>
      );
    }

    return (
      <button
        type="button"
        {...preview}
        onClick={onOpen}
        className={`${shellClass} w-full cursor-zoom-in text-left`}
        style={shellStyle}
        aria-label={`Open ${item.title || item.alt || "piece"}`}
      >
        {media}
      </button>
    );
  }

  if (href) {
    return (
      <a href={href} {...preview} className={`${shellClass} block`} style={shellStyle}>
        {media}
      </a>
    );
  }

  return (
    <figure className={shellClass} style={shellStyle} {...preview}>
      {media}
    </figure>
  );
}
