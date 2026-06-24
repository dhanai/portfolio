import type { Metadata } from "next";
import { CreativeShowcaseSection } from "@/components/creative-showcase-section";
import { ProjectCard } from "@/components/project-card";
import { getCreativeShowcase, getProjects, getSiteConfigFromCms } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfigFromCms();
  return {
    title: "Work",
    description: `Case studies and art direction — ${config.fullName}`,
  };
}

export default async function WorkPage() {
  const [projects, showcase] = await Promise.all([
    getProjects(),
    getCreativeShowcase(),
  ]);

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <header className="mb-16 max-w-2xl border-b border-border pb-10">
          <p className="label-caps text-muted">Portfolio</p>
          <h1 className="mt-4 text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            Work
          </h1>
          <p className="mt-4 text-muted leading-relaxed">
            Founder-led projects — from hand-drawn apparel to agent-native ops and
            consumer mobile.
          </p>
        </header>
        <div className="grid gap-px bg-border md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} {...project} index={index} />
          ))}
        </div>
      </div>

      <CreativeShowcaseSection showcase={showcase} />
    </>
  );
}
