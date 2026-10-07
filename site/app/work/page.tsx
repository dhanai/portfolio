import type { Metadata } from "next";
import { CreativeShowcaseSection } from "@/components/creative-showcase-section";
import { ProjectCard } from "@/components/project-card";
import { getCreativeShowcase, getProjects, getSiteConfigFromCms } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:pb-20 md:pt-12">
        <header className="mb-8 max-w-2xl">
          <p className="label-caps text-muted">Portfolio</p>
          <h1 className="mt-2 text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            Work
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted md:text-[0.9375rem]">
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
