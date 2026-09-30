"use client";

import { CreativeShowcaseCard } from "@/components/creative-showcase-card";
import { useHorizontalRailWheel } from "@/components/use-horizontal-rail";
import type { CreativeShowcaseItem } from "@/lib/defaults/creative-showcase";

export function CreativeShowcaseRail({
  items,
}: {
  items: CreativeShowcaseItem[];
}) {
  const railRef = useHorizontalRailWheel<HTMLDivElement>("creative");

  return (
    <div
      ref={railRef}
      className="mt-12 flex gap-4 overflow-x-auto overflow-y-clip overscroll-x-contain px-6 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="region"
      aria-label="Creative work gallery"
    >
      {items.map((item) => (
        <CreativeShowcaseCard
          key={item.id}
          item={item}
          className="w-[220px] shrink-0 sm:w-[248px] md:w-[272px]"
          href={`/ai?v=${encodeURIComponent(item.id)}`}
        />
      ))}
    </div>
  );
}
