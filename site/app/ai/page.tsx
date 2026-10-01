import type { Metadata } from "next";
import Link from "next/link";
import { CreativeShowcaseGrid } from "@/components/creative-showcase-grid";
import { FadeIn } from "@/components/project-card";
import { getCreativeShowcase, getSiteConfigFromCms } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams: Promise<{ v?: string | string[] }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const [config, showcase, { v }] = await Promise.all([
    getSiteConfigFromCms(),
    getCreativeShowcase(),
    searchParams,
  ]);
  const base: Metadata = {
    title: showcase.title || "AI creative",
    description:
      showcase.subtitle ||
      `Generative art direction and campaign craft — ${config.fullName}`,
    robots: {
      index: true,
      follow: true,
    },
  };

  const id = typeof v === "string" ? v : undefined;
  const item = id ? showcase.items.find((entry) => entry.id === id) : undefined;
  if (!item || (!item.poster && item.type !== "image")) return base;

  const title = `${item.title} · ${config.name}`;
  const description = item.direction || showcase.subtitle || config.description;
  const image = {
    url: `/ai/og?v=${encodeURIComponent(item.id)}`,
    width: 1200,
    height: 630,
    alt: item.title,
  };
  return {
    ...base,
    title: item.title,
    description,
    openGraph: {
      title,
      description,
      url: `/ai?v=${encodeURIComponent(item.id)}`,
      siteName: config.name,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export default async function AiPage() {
  const showcase = await getCreativeShowcase();
  const hasItems = showcase.enabled && showcase.items.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:pb-20 md:pt-12">
      <header className="mb-8 max-w-2xl">
        <FadeIn>
          <p className="label-caps text-muted">{showcase.eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            {showcase.title}
          </h1>
          {showcase.subtitle ? (
            <p className="mt-2 text-sm leading-relaxed text-muted md:text-[0.9375rem]">
              {showcase.subtitle}
            </p>
          ) : null}
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
