"use client";

import { useEffect, useRef } from "react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/projects";

export function WorkScrollRail({ projects }: { projects: Project[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const pixels = (event: WheelEvent, delta: number) => {
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return delta * 16;
      if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        return delta * window.innerHeight;
      }
      return delta;
    };

    const onWheel = (event: WheelEvent) => {
      const horizontal =
        event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);

      if (!horizontal) {
        if (event.deltaY === 0) return;
        event.preventDefault();
        window.scrollBy(0, pixels(event, event.deltaY));
        return;
      }

      const delta = pixels(
        event,
        event.shiftKey ? event.deltaY : event.deltaX,
      );
      const max = rail.scrollWidth - rail.clientWidth;
      const next = Math.min(max, Math.max(0, rail.scrollLeft + delta));
      if (next === rail.scrollLeft) return;

      rail.scrollLeft = next;
      event.preventDefault();
    };

    rail.addEventListener("wheel", onWheel, { passive: false });
    return () => rail.removeEventListener("wheel", onWheel);
  }, []);

  if (projects.length === 0) {
    return <p className="px-6 py-10 text-sm text-muted">No work yet.</p>;
  }

  return (
    <div
      ref={railRef}
      className="flex gap-4 overflow-x-auto overflow-y-clip overscroll-x-contain px-6 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="region"
      aria-label="Selected work"
    >
      {projects.map((project, index) => (
        <div
          key={project.slug}
          className="w-[min(78vw,420px)] shrink-0"
        >
          <ProjectCard {...project} index={index} />
        </div>
      ))}
    </div>
  );
}
