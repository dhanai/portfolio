"use client";

import Link from "next/link";
import type { Project } from "@/lib/projects";

function isRemoteUrl(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function projectHref(project: Project) {
  if (project.cardAction === "lightbox") {
    return "#work";
  }
  if (project.cardAction === "external" && project.href) {
    return project.href;
  }
  return `/work/${project.slug}`;
}

export function HeroWorkStrip({ projects }: { projects: Project[] }) {
  const items = projects.filter((p) => Boolean(p.image)).slice(0, 3);
  if (items.length === 0) return null;

  return (
    <div className="hero-work-strip relative z-10 hidden border-t border-border md:block">
      <div className="grid grid-cols-3">
        {items.map((project, index) => {
          const href = projectHref(project);
          const external = project.cardAction === "external" && Boolean(project.href);
          const img = project.image!;

          return (
            <Link
              key={project.slug}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="hero-work-strip__item group relative block aspect-[5/4] overflow-hidden border-border bg-[#0a0a0a] border-r last:border-r-0"
              style={{ animationDelay: `${120 + index * 90}ms` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                {...(isRemoteUrl(img)
                  ? {}
                  : { width: 800, height: 640 })}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <p className="label-caps text-white/50">{project.year}</p>
                <p className="mt-1.5 text-xs font-medium tracking-tight text-foreground md:text-sm">
                  {project.title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
