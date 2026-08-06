import { FadeIn } from "@/components/project-card";
import { CreativeShowcaseRail } from "@/components/creative-showcase-rail";
import type { CreativeShowcaseData } from "@/lib/defaults/creative-showcase";

export function CreativeShowcaseSection({
  showcase,
}: {
  showcase: CreativeShowcaseData;
}) {
  if (!showcase.enabled || showcase.items.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <div className="mb-12">
            <p className="label-caps text-muted">Creative</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {showcase.title}
            </h2>
            <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted md:text-sm">
              {showcase.subtitle}
            </p>
          </div>
        </FadeIn>
      </div>
      <CreativeShowcaseRail items={showcase.items} />
    </section>
  );
}
