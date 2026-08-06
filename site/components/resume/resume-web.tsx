import type { ResumeContentData } from "@/lib/content";
import { getResumeContent } from "@/lib/content";

export async function ResumeWeb({ data }: { data?: ResumeContentData }) {
  const resume = data ?? (await getResumeContent());
  const { contact } = resume;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <header className="border-b border-border pb-10">
        <p className="label-caps text-muted">{contact.location}</p>
        <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
          {resume.name}
        </h1>
        <p className="mt-4 text-sm font-medium tracking-tight text-foreground md:text-[0.9375rem]">
          {resume.headline}
        </p>
        <p className="mt-1.5 text-xs text-muted">{resume.subheadline}</p>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs md:text-sm">
          <a
            href={`mailto:${contact.email}`}
            className="text-foreground transition-colors hover:text-accent"
          >
            {contact.email}
          </a>
          <a
            href={`tel:${contact.phone.replace(/\./g, "")}`}
            className="text-foreground transition-colors hover:text-accent"
          >
            {contact.phone}
          </a>
          <a
            href={`https://${contact.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground transition-colors hover:text-accent"
          >
            {contact.linkedin}
          </a>
          <a
            href={`https://${contact.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground transition-colors hover:text-accent"
          >
            {contact.github}
          </a>
          <a
            href={`https://${contact.portfolio}`}
            className="text-foreground transition-colors hover:text-accent"
          >
            {contact.portfolio}
          </a>
        </div>
      </header>

      <section className="mt-12">
        <h2 className="label-caps text-muted">Summary</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted md:text-[0.9375rem]">
          {resume.summary}
        </p>
      </section>

      <section className="mt-16">
        <h2 className="label-caps text-muted">Experience</h2>
        <div className="mt-8 divide-y divide-border">
          {resume.experience.map((job) => (
            <article key={job.company} className="py-8 first:pt-0">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                    {job.company}
                  </h3>
                  <p className="mt-1 text-xs text-muted md:text-sm">{job.role}</p>
                </div>
                <time className="shrink-0 text-xs text-muted">{job.period}</time>
              </div>
              <ul className="mt-5 space-y-3">
                {job.bullets.map((bullet) => (
                  <li
                    key={bullet.slice(0, 40)}
                    className="flex gap-4 text-xs leading-relaxed text-muted md:text-sm"
                  >
                    <span className="mt-2 h-px w-3 shrink-0 bg-accent" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="label-caps text-muted">Earlier career</h2>
        <p className="mt-2 text-xs text-muted md:text-sm">
          {"earlierCareerIntro" in resume && resume.earlierCareerIntro
            ? resume.earlierCareerIntro
            : "20+ years across agencies and product teams"}
        </p>
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {resume.earlierCareer.map((job) => (
            <li
              key={job.company}
              className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <span className="text-xs text-foreground md:text-sm">
                {job.company}
                <span className="text-muted"> — {job.role}</span>
              </span>
              <span className="text-xs text-muted">{job.period}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 pb-8">
        <h2 className="label-caps text-muted">Skills</h2>
        <dl className="mt-8 grid gap-10 sm:grid-cols-2">
          {Object.entries(resume.skills).map(([category, items]) => (
            <div key={category} className="border-t border-border pt-4">
              <dt className="label-caps text-accent">{category}</dt>
              <dd className="mt-3 text-xs leading-relaxed text-muted md:text-sm">
                {items}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
