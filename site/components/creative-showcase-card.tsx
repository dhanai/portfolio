"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { CreativeShowcaseItem } from "@/lib/defaults/creative-showcase";

function isRemoteUrl(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

export function CreativeShowcaseCard({
  item,
  className = "",
}: {
  item: CreativeShowcaseItem;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (item.type !== "video") return;
    const video = videoRef.current;
    if (!video) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [item.type]);

  return (
    <figure
      className={`creative-showcase-card group relative aspect-[9/16] overflow-hidden border border-border bg-[#0a0a0a] ${className}`}
      style={{ "--card-accent": "#0A84FF" } as CSSProperties}
    >
      {item.type === "video" ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={item.src}
          poster={item.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={item.alt}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.alt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80"
        aria-hidden="true"
      />

      {(item.title || item.direction) && (
        <figcaption className="absolute inset-x-0 bottom-0 z-[1] p-4">
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
        </figcaption>
      )}

      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-px scale-y-0 bg-[var(--card-accent)] transition-transform duration-500 group-hover:scale-y-100"
        aria-hidden="true"
      />
    </figure>
  );
}
