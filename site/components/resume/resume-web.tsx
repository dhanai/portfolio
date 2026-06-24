import type { ResumeContentData } from "@/lib/content";
import { getResumeContent } from "@/lib/content";

export async function ResumeWeb({ data }: { data?: ResumeContentData }) {
  const resume = data ?? (await getResumeContent());
  const { contact } = resume;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <header className="border-b border-border pb-10">
        <div className="mb-6 h-px w-12 bg-accent" />
        <h1 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl">
          {resume.name}
        </h1>
        <p className="mt-3 text-sm text-muted">{resume.headline}</p>
        <p className="mt-1 font-mono text-xs text-muted/80">{resume.subheadline}</p>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <span className="text-muted">{contact.location}</span>
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
        <p className="mt-4 text-lg leading-relaxed text-muted">{resume.summary}</p>
      </section>

      <section className="mt-16">
        <h2 className="label-caps text-muted">Experience</h2>
        <div className="mt-8 divide-y divide-border">
          {resume.experience.map((job) => (
            <article key={job.company} className="py-8 first:pt-0">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-lg font-medium text-foreground">
                  {job.company}
                  <span className="font-normal text-muted"> — {job.role}</span>
                </h3>
                <time className="font-mono text-xs text-muted">{job.period}</time>
              </div>
              <ul className="mt-4 space-y-3">
                {job.bullets.map((bullet) => (
                  <li
                    key={bullet.slice(0, 40)}
                    className="flex gap-4 text-sm leading-relaxed text-muted"
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
        <p className="mt-2 text-sm text-muted">
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
              <span className="text-sm text-foreground">
                {job.company}
                <span className="text-muted"> — {job.role}</span>
              </span>
              <span className="font-mono text-xs text-muted">{job.period}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 pb-8">
        <h2 className="label-caps text-muted">Skills</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {Object.entries(resume.skills).map(([category, items]) => (
            <div
              key={category}
              className="border border-border p-4 transition-colors hover:border-accent/40"
            >
              <dt className="font-mono text-[10px] uppercase tracking-wider text-accent">
                {category}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{items}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
