"use client";

import { ProjectCard } from "@/components/project-card";
import { useHorizontalRailWheel } from "@/components/use-horizontal-rail";
import type { Project } from "@/lib/projects";

export function WorkScrollRail({ projects }: { projects: Project[] }) {
  const railRef = useHorizontalRailWheel<HTMLDivElement>("work");

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
