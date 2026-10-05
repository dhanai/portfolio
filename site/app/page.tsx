import Link from "next/link";
import { CreativeShowcaseSection } from "@/components/creative-showcase-section";
import { FadeIn } from "@/components/project-card";
import { WorkScrollRail } from "@/components/work-scroll-rail";
import {
  getAboutContent,
  getCreativeShowcase,
  getProjects,
  getSiteContent,
} from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [projects, site, showcase, about] = await Promise.all([
    getProjects(),
    getSiteContent(),
    getCreativeShowcase(),
    getAboutContent(),
  ]);

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-6 pt-16 md:pt-24">
        <h1 className="font-display max-w-5xl text-balance text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl">
          {site.fullName}
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted md:text-base">
          {site.oneLiner}
        </p>
      </section>

      <CreativeShowcaseSection
        showcase={showcase}
        className="scroll-mt-24 py-10 md:py-14"
      />

      <section id="work" className="scroll-mt-24 border-t border-border py-16 md:py-24">
        <div className="mx-auto mb-8 max-w-6xl px-6">
          <p className="label-caps text-muted">Work</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {site.workSectionTitle}
          </h2>
        </div>
        <WorkScrollRail projects={projects} />
      </section>

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
              <div className="mt-8">
                <a
                  href={`mailto:${site.links.email}`}
                  className="inline-flex items-center justify-center bg-foreground px-5 py-2.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
                >
                  Get in touch
                </a>
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
