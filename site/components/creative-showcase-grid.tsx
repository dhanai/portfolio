"use client";

import { useCallback, useState } from "react";
import { FadeIn } from "@/components/project-card";
import { CreativeShowcaseCard } from "@/components/creative-showcase-card";
import { CreativeShowcaseLightbox } from "@/components/creative-showcase-lightbox";
import type { CreativeShowcaseItem } from "@/lib/defaults/creative-showcase";

export function CreativeShowcaseGrid({
  items,
}: {
  items: CreativeShowcaseItem[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  return (
    <>
      <div
        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
        role="list"
        aria-label="Generative work gallery"
      >
        {items.map((item, index) => (
          <FadeIn key={item.id} delay={Math.min(index * 40, 240)}>
            <div role="listitem">
              <CreativeShowcaseCard
                item={item}
                className="w-full"
                onOpen={() => setActiveIndex(index)}
              />
            </div>
          </FadeIn>
        ))}
      </div>

      {activeIndex !== null && (
        <CreativeShowcaseLightbox
          items={items}
          index={activeIndex}
          onClose={close}
          onChangeIndex={setActiveIndex}
        />
      )}
    </>
  );
}
