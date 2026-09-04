import type { Metadata } from "next";
import Link from "next/link";
import { CreativeShowcaseGrid } from "@/components/creative-showcase-grid";
import { FadeIn } from "@/components/project-card";
import { getCreativeShowcase, getSiteConfigFromCms } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const [config, showcase] = await Promise.all([
    getSiteConfigFromCms(),
    getCreativeShowcase(),
  ]);
  return {
    title: "AI creative",
    description:
      showcase.subtitle ||
      `Generative art direction and campaign craft — ${config.fullName}`,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function AiPage() {
  const showcase = await getCreativeShowcase();
  const hasItems = showcase.enabled && showcase.items.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <header className="mb-16 max-w-2xl">
        <FadeIn>
          <p className="label-caps text-muted">Generative</p>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            {showcase.title || "AI creative"}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-[0.9375rem]">
            {showcase.subtitle ||
              "Directed generative campaigns, stills, and motion — taste as the production system."}
          </p>
        </FadeIn>
      </header>

      {hasItems ? (
        <CreativeShowcaseGrid items={showcase.items} />
      ) : (
        <FadeIn>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            New pieces land here as they ship. Meanwhile, see product and brand
            work on the{" "}
            <Link
              href="/#work"
              className="text-foreground underline-offset-4 hover:underline"
            >
              homepage
            </Link>
            .
          </p>
        </FadeIn>
      )}
    </div>
  );
}
