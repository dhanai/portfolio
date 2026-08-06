import Link from "next/link";
import { HeroGradient } from "@/components/hero-gradient";
import { HeroWorkStrip } from "@/components/hero-work-strip";
import { CreativeShowcaseSection } from "@/components/creative-showcase-section";
import { FadeIn } from "@/components/project-card";
import { ResumeActions } from "@/components/resume-actions";
import { WorkFilterGrid } from "@/components/work-filter-grid";
import {
  getAboutContent,
  getCreativeShowcase,
  getProjects,
  getSiteContent,
} from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const howIWork = [
  {
    title: "Art direction",
    body: "Brand systems, campaigns, motion, and taste — the look and feel people remember.",
  },
  {
    title: "Product design",
    body: "Flows, IA, and interfaces for operators and end users — how the product actually works.",
  },
  {
    title: "AI + ship",
    body: "Generative creative as a production system, and Next.js when building beats briefing.",
  },
];

export default async function HomePage() {
  const [projects, site, showcase, about] = await Promise.all([
    getProjects(),
    getSiteContent(),
    getCreativeShowcase(),
    getAboutContent(),
  ]);
  const featuredProjects = projects.slice(0, site.homepageWorkCount);

  return (
    <>
      <section className="relative flex flex-col overflow-hidden border-b border-border md:min-h-[min(100svh,920px)]">
        <HeroGradient />
        <div className="hero-copy relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-6 pb-16 pt-24 md:pb-14 md:pt-32 lg:pt-36">
          <p className="hero-rise label-caps text-muted">{site.hero.label}</p>
          <h1 className="hero-rise hero-rise-delay-1 font-display mt-5 max-w-5xl text-balance text-4xl font-medium leading-[1.02] tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {site.fullName}
          </h1>
          <p className="hero-rise hero-rise-delay-2 hero-headline mt-6 max-w-2xl text-sm font-medium tracking-tight text-foreground md:text-base">
            {site.hero.title}{" "}
            <span className="text-muted">{site.hero.titleMuted}</span>
          </p>
          <p className="hero-rise hero-rise-delay-2 mt-4 max-w-md text-sm leading-relaxed text-muted md:text-[0.9375rem]">
            {site.oneLiner}
          </p>
          <div className="hero-rise hero-rise-delay-3 mt-10 flex flex-wrap items-center gap-6">
            <a
              href="#work"
              className="inline-flex items-center gap-2 bg-foreground px-5 py-2.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
            >
              View work
              <span className="text-accent">↓</span>
            </a>
            <Link
              href="/resume"
              className="label-caps text-muted transition-colors hover:text-foreground"
            >
              Resume
            </Link>
          </div>
        </div>
        <HeroWorkStrip projects={featuredProjects} />
      </section>

      <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 md:py-28">
        <FadeIn>
          <div className="mb-12">
            <p className="label-caps text-muted">Work</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Selected work
            </h2>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted md:text-sm">
              Brand craft and product systems — filter by lane
            </p>
          </div>
        </FadeIn>
        <WorkFilterGrid projects={featuredProjects} />
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-28">
          <FadeIn>
            <p className="label-caps text-muted">Approach</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Own the look, the loop, and the ship
            </h2>
          </FadeIn>
          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10 lg:gap-14">
            {howIWork.map((item, index) => (
              <FadeIn key={item.title} delay={index * 70}>
                <div className="h-full">
                  <div className="flex items-baseline gap-3 border-b border-border pb-4">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base font-medium tracking-tight text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-5 text-xs leading-relaxed text-muted md:text-sm">
                    {item.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CreativeShowcaseSection showcase={showcase} />

      <section id="about" className="scroll-mt-24 border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:py-28 lg:grid-cols-[1.45fr_1fr] lg:gap-24">
          <FadeIn>
            <p className="label-caps text-muted">About</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {site.fullName}
            </h2>
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted md:text-[0.9375rem]">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={80}>
            <div className="border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0">
              <p className="label-caps text-accent">{about.ctaTitle}</p>
              <p className="mt-4 text-xs leading-relaxed text-muted md:text-sm">
                {about.ctaBody}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href={`mailto:${site.links.email}`}
                  className="inline-flex items-center justify-center bg-foreground px-5 py-2.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
                >
                  Get in touch
                </a>
                <ResumeActions />
              </div>
              <Link
                href="/resume"
                className="mt-8 inline-block label-caps text-muted transition-colors hover:text-foreground"
              >
                View full resume →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
