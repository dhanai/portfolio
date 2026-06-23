"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

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

type ProjectCardProps = {
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
  year: string;
  color: string;
  href?: string;
  image?: string;
  index?: number;
};

export function ProjectCard({
  slug,
  title,
  subtitle,
  tags,
  year,
  color,
  href,
  image,
  index = 0,
}: ProjectCardProps) {
  const linkHref = href ?? `/work/${slug}`;
  const isExternalImage =
    image?.startsWith("http://") || image?.startsWith("https://");

  return (
    <FadeIn delay={index * 60}>
      <Link
        href={linkHref}
        className="group block"
        {...(href ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <article
          className="relative overflow-hidden border border-border bg-surface transition-all duration-500 hover:bg-surface-hover"
          style={{ ["--card-accent" as string]: color }}
        >
          <div
            className="absolute left-0 top-0 h-full w-px scale-y-0 bg-[var(--card-accent)] transition-transform duration-500 group-hover:scale-y-100"
            aria-hidden="true"
          />
          <div className="relative aspect-[4/5] overflow-hidden bg-[#0a0a0a]">
            {image ? (
              <>
                {isExternalImage ? (
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
              <span className="label-caps text-muted">{year}</span>
              <span
                className="font-mono text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ color }}
              >
                →
              </span>
            </div>
          </div>
          <div className="border-t border-border p-6">
            <h3 className="text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-[var(--card-accent)]">
              {title}
            </h3>
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </Link>
    </FadeIn>
  );
}
