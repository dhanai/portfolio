"use client";

import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { WorkCardAction } from "@/lib/admin/types";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function FadeIn({ children, className = "", delay = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function isRemoteUrl(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function WorkLightbox({
  src,
  title,
  onClose,
}: {
  src: string;
  title: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-[1] border border-white/20 bg-black/40 px-3 py-1.5 text-xs uppercase tracking-wider text-white transition-colors hover:border-white hover:bg-black/70 sm:right-8 sm:top-8"
      >
        Close
      </button>

      <div
        className="relative w-[80vw]"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="aspect-[1680/1050] max-h-[90vh] overflow-y-auto border border-white/10 bg-[#0a0a0a]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={title}
            className="block h-auto w-full"
          />
        </div>
        <figcaption
          id={titleId}
          className="mt-3 text-center text-sm text-[#a3a3a3]"
        >
          {title}
        </figcaption>
      </div>
    </div>,
    document.body,
  );
}

type ProjectCardProps = {
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
  year?: string;
  color: string;
  href?: string;
  image?: string;
  cardAction?: WorkCardAction;
  lightboxImage?: string;
  index?: number;
};

function CardMedia({
  image,
  color,
  year,
  actionHint,
}: {
  image?: string;
  color: string;
  year?: string;
  actionHint: string;
}) {
  const remote = image ? isRemoteUrl(image) : false;

  return (
    <div className="relative aspect-[5/4] overflow-hidden bg-[#0a0a0a]">
      {image ? (
        <>
          {remote ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <Image
              src={image}
              alt=""
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent"
            aria-hidden="true"
          />
        </>
      ) : (
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${color}18 0%, transparent 70%)`,
          }}
        />
      )}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${color}22 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-end justify-between p-6">
        {year ? (
          <span className="label-caps text-muted">{year}</span>
        ) : (
          <span />
        )}
        <span
          className="font-mono text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ color }}
        >
          {actionHint}
        </span>
      </div>
    </div>
  );
}

function CardBody({
  title,
  subtitle,
  tags,
}: {
  title: string;
  subtitle: string;
  tags: string[];
}) {
  return (
    <div className="border-t border-border p-6">
      <h3 className="text-base font-medium tracking-tight text-foreground transition-colors group-hover:text-[var(--card-accent)]">
        {title}
      </h3>
      <p className="mt-1 text-xs text-muted md:text-sm">{subtitle}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => {
          const lane =
            tag.toLowerCase() === "brand" || tag.toLowerCase() === "product";
          return (
            <li
              key={tag}
              className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                lane
                  ? "border-[var(--card-accent)]/50 text-[var(--card-accent)]"
                  : "border-border text-muted"
              }`}
            >
              {tag}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ProjectCard({
  slug,
  title,
  subtitle,
  tags,
  year,
  color,
  href,
  image,
  cardAction = "caseStudy",
  lightboxImage,
  index = 0,
}: ProjectCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const resolvedAction =
    cardAction === "external" || cardAction === "lightbox"
      ? cardAction
      : href
        ? "external"
        : "caseStudy";
  const lightboxSrc = lightboxImage || image;
  const actionHint =
    resolvedAction === "lightbox" ? "↗" : resolvedAction === "external" ? "↗" : "→";

  const article = (
    <article
      className="relative overflow-hidden border border-border bg-surface transition-all duration-500 hover:bg-surface-hover"
      style={{ ["--card-accent" as string]: color }}
    >
      <div
        className="absolute left-0 top-0 h-full w-px scale-y-0 bg-[var(--card-accent)] transition-transform duration-500 group-hover:scale-y-100"
        aria-hidden="true"
      />
      <CardMedia
        image={image}
        color={color}
        year={year}
        actionHint={actionHint}
      />
      <CardBody title={title} subtitle={subtitle} tags={tags} />
    </article>
  );

  return (
    <FadeIn delay={index * 60}>
      {resolvedAction === "lightbox" ? (
        <>
          <button
            type="button"
            className="group block w-full cursor-zoom-in text-left"
            onClick={() => {
              if (lightboxSrc) setLightboxOpen(true);
            }}
            aria-label={`View larger image of ${title}`}
          >
            {article}
          </button>
          {lightboxOpen && lightboxSrc ? (
            <WorkLightbox
              src={lightboxSrc}
              title={title}
              onClose={() => setLightboxOpen(false)}
            />
          ) : null}
        </>
      ) : (
        <Link
          href={
            resolvedAction === "external" && href ? href : `/work/${slug}`
          }
          className="group block"
          {...(resolvedAction === "external"
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {article}
        </Link>
      )}
    </FadeIn>
  );
}
