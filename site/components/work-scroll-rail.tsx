import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/projects";

export function WorkScrollRail({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="px-6 py-10 text-sm text-muted">No work yet.</p>
    );
  }

  return (
    <div
      className="creative-rail flex gap-4 overflow-x-auto px-6 pb-2 pt-1 scroll-smooth"
      tabIndex={0}
      role="region"
      aria-label="Selected work"
    >
      {projects.map((project, index) => (
        <div
          key={project.slug}
          className="w-[min(78vw,420px)] shrink-0 snap-start"
        >
          <ProjectCard {...project} index={index} />
        </div>
      ))}
    </div>
  );
}
