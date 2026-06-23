import Link from "next/link";
import { HeroGradient } from "@/components/hero-gradient";
import { HeroPortrait } from "@/components/hero-portrait";
import { ProjectCard, FadeIn } from "@/components/project-card";
import { getProjects, getSiteContent } from "@/lib/content";

export default async function HomePage() {
  const [projects, site] = await Promise.all([
    getProjects(),
    getSiteContent(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <HeroGradient />
        <HeroPortrait />
        <div className="hero-copy relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32 lg:py-36">
          <FadeIn>
            <p className="label-caps text-muted">{site.hero.label}</p>
            <h1 className="mt-6 max-w-4xl text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] text-foreground md:text-6xl lg:text-7xl lg:max-w-3xl">
              {site.hero.title}{" "}
              <span className="text-muted">{site.hero.titleMuted}</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
              {site.oneLiner}
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                View work
                <span className="text-accent">→</span>
              </Link>
              <Link
                href="/resume"
                className="label-caps text-muted transition-colors hover:text-foreground"
              >
                Resume
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <FadeIn>
          <div className="mb-14 flex items-end justify-between border-b border-border pb-6">
            <div>
              <h2 className="text-2xl font-medium tracking-tight text-foreground">
                Selected work
              </h2>
              <p className="mt-2 text-sm text-muted">
                Brand, B2B ops, agents, mobile
              </p>
            </div>
            <Link
              href="/work"
              className="label-caps text-muted transition-colors hover:text-accent"
            >
              All projects
            </Link>
          </div>
        </FadeIn>
        <div className="grid gap-px bg-border md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} {...project} index={index} />
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <FadeIn>
            <p className="label-caps text-accent">{site.now.label}</p>
            <h2 className="mt-4 text-2xl font-medium tracking-tight text-foreground">
              {site.now.title}
            </h2>
            <p className="mt-4 max-w-xl text-muted leading-relaxed">{site.now.body}</p>
            <a
              href={site.now.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-accent"
            >
              {site.now.linkLabel}
              <span>→</span>
            </a>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
