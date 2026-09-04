"use client";

import { FadeIn } from "@/components/project-card";
import { CreativeShowcaseCard } from "@/components/creative-showcase-card";
import type { CreativeShowcaseItem } from "@/lib/defaults/creative-showcase";

export function CreativeShowcaseGrid({
  items,
}: {
  items: CreativeShowcaseItem[];
}) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
      role="list"
      aria-label="Generative work gallery"
    >
      {items.map((item, index) => (
        <FadeIn key={item.id} delay={Math.min(index * 40, 240)}>
          <div role="listitem">
            <CreativeShowcaseCard item={item} className="w-full" />
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
