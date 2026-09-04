"use client";

import { CreativeShowcaseCard } from "@/components/creative-showcase-card";
import type { CreativeShowcaseItem } from "@/lib/defaults/creative-showcase";

export function CreativeShowcaseRail({
  items,
}: {
  items: CreativeShowcaseItem[];
}) {
  return (
    <div className="relative mt-12">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent sm:w-16"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent sm:w-16"
        aria-hidden="true"
      />

      <div
        className="creative-rail flex gap-4 overflow-x-auto px-6 pb-2 pt-1 scroll-smooth"
        tabIndex={0}
        role="region"
        aria-label="Creative work gallery"
      >
        {items.map((item) => (
          <CreativeShowcaseCard
            key={item.id}
            item={item}
            className="w-[220px] shrink-0 snap-start sm:w-[248px] md:w-[272px]"
          />
        ))}
      </div>
    </div>
  );
}
