import Link from "next/link";
import type { CaseStudy } from "@/lib/case-studies";
import type { Project } from "@/lib/projects";

type CaseStudyLayoutProps = {
  study: CaseStudy;
  projects: Project[];
};

export function CaseStudyLayout({ study, projects }: CaseStudyLayoutProps) {
  const currentIndex = projects.findIndex((p) => p.slug === study.slug);
  const nextProject =
    projects.length > 0
      ? projects[(currentIndex + 1) % projects.length]
      : { slug: "", title: "Work" };
  const project = projects.find((p) => p.slug === study.slug);
  const accent = project?.color ?? "#ff453a";

  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
          <div className="flex flex-wrap items-center gap-3 label-caps text-muted">
            <span>{study.year}</span>
            <span aria-hidden="true" style={{ color: accent }}>
              /
            </span>
            <span>{study.role}</span>
          </div>
          <h1 className="mt-6 text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">
            {study.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {study.subtitle}
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {study.tags.map((tag) => (
              <li
                key={tag}
                className="border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
          {study.externalUrl && (
            <a
              href={study.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-accent"
            >
              Visit live site →
            </a>
          )}
        </div>
      </header>

      {study.diagram && (
        <div className="border-b border-border bg-surface">
          <div className="mx-auto max-w-4xl px-6 py-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={study.diagram}
              alt={`${study.title} architecture diagram`}
              className="mx-auto w-full max-w-2xl opacity-90"
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6 py-20">
        {study.sections.map((section) => (
          <section key={section.heading} className="mb-16">
            <h2 className="text-xl font-medium tracking-tight text-foreground">
              {section.heading}
            </h2>
            <div className="mt-5 space-y-4">
              {section.paragraphs.map((p, i) => (
                <p key={i} className="leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
            {section.bullets && (
              <ul className="mt-5 space-y-3">
                {section.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-4 leading-relaxed text-muted"
                  >
                    <span
                      className="mt-2.5 h-px w-4 shrink-0"
                      style={{ backgroundColor: accent }}
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <aside
          className="border border-border p-8"
          style={{ borderLeftColor: accent, borderLeftWidth: 2 }}
        >
          <p className="label-caps text-muted">Reflection</p>
          <p className="mt-4 text-lg leading-relaxed text-foreground">
            {study.reflection}
          </p>
        </aside>
      </div>

      <nav className="border-t border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-12">
          <Link
            href="/work"
            className="label-caps text-muted transition-colors hover:text-foreground"
          >
            ← All work
          </Link>
          <Link
            href={`/work/${nextProject.slug}`}
            className="text-sm text-foreground transition-colors hover:text-accent"
          >
            Next — {nextProject.title} →
          </Link>
        </div>
      </nav>
    </article>
  );
}
