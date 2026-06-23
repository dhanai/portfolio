import type { Metadata } from "next";
import Link from "next/link";
import {
  getAboutContent,
  getSiteConfigFromCms,
  getSiteContent,
} from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfigFromCms();
  return {
    title: "About",
    description: config.oneLiner,
  };
}

export default async function AboutPage() {
  const [about, site] = await Promise.all([
    getAboutContent(),
    getSiteContent(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      <p className="label-caps text-muted">About</p>
      <h1 className="mt-4 text-4xl font-medium tracking-tight text-foreground md:text-5xl">
        {site.fullName}
      </h1>

      <div className="mt-12 space-y-6 leading-relaxed text-muted">
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>

      <section className="mt-20">
        <h2 className="text-xl font-medium text-foreground">Capabilities</h2>
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {about.skills.map((skill) => (
            <li
              key={skill.area}
              className="flex items-center justify-between py-4"
            >
              <span className="text-sm text-foreground">{skill.area}</span>
              <span
                className="font-mono text-[10px] uppercase tracking-wider"
                style={{ color: skill.accent }}
              >
                {skill.level}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 border border-border p-8">
        <p className="label-caps text-accent">{about.ctaTitle}</p>
        <p className="mt-4 text-muted">{about.ctaBody}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={`mailto:${site.links.email}`}
            className="bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Get in touch
          </a>
          <Link
            href="/resume"
            className="border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:border-foreground"
          >
            Resume
          </Link>
        </div>
      </section>
    </div>
  );
}
