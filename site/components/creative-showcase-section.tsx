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
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <div className="border-b border-border pb-6">
            <h2 className="text-2xl font-medium tracking-tight text-foreground">
              {showcase.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">{showcase.subtitle}</p>
          </div>
        </FadeIn>
      </div>
      <CreativeShowcaseRail items={showcase.items} />
    </section>
  );
}
