"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/projects";
import {
  WORK_LANES,
  projectMatchesLane,
  type WorkLane,
} from "@/lib/work-lanes";

export function WorkFilterGrid({ projects }: { projects: Project[] }) {
  const [lane, setLane] = useState<WorkLane>("all");

  const filtered = useMemo(
    () => projects.filter((project) => projectMatchesLane(project, lane)),
    [projects, lane],
  );

  return (
    <div>
      <div
        className="mb-10 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter work by lane"
      >
        {WORK_LANES.map((option) => {
          const active = lane === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setLane(option.id)}
              className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted hover:border-foreground hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-sm text-muted">No projects in this lane yet.</p>
      ) : (
        <div className="grid gap-px bg-border md:grid-cols-2">
          {filtered.map((project, index) => (
            <ProjectCard key={project.slug} {...project} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
