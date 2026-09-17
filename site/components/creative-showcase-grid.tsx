"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FadeIn } from "@/components/project-card";
import { CreativeShowcaseCard } from "@/components/creative-showcase-card";
import { CreativeShowcaseLightbox } from "@/components/creative-showcase-lightbox";
import type { CreativeShowcaseItem } from "@/lib/defaults/creative-showcase";

const PIECE_PARAM = "v";

function indexForPieceId(items: CreativeShowcaseItem[], id: string | null) {
  if (!id) return null;
  const index = items.findIndex((item) => item.id === id);
  return index >= 0 ? index : null;
}

function CreativeShowcaseGridInner({
  items,
}: {
  items: CreativeShowcaseItem[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pieceId = searchParams.get(PIECE_PARAM);
  const urlIndex = indexForPieceId(items, pieceId);

  const [activeIndex, setActiveIndex] = useState<number | null>(urlIndex);

  useEffect(() => {
    setActiveIndex(urlIndex);
  }, [urlIndex]);

  const syncUrl = useCallback(
    (index: number | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (index === null) {
        params.delete(PIECE_PARAM);
      } else {
        const item = items[index];
        if (!item) return;
        params.set(PIECE_PARAM, item.id);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [items, pathname, router, searchParams],
  );

  const openAt = useCallback(
    (index: number) => {
      setActiveIndex(index);
      syncUrl(index);
    },
    [syncUrl],
  );

  const close = useCallback(() => {
    setActiveIndex(null);
    syncUrl(null);
  }, [syncUrl]);

  const changeIndex = useCallback(
    (index: number) => {
      setActiveIndex(index);
      syncUrl(index);
    },
    [syncUrl],
  );

  return (
    <>
      <div
        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
        role="list"
        aria-label="Generative work gallery"
      >
        {items.map((item, index) => (
          <FadeIn key={item.id} delay={Math.min(index * 40, 240)}>
            <div role="listitem" id={`piece-${item.id}`}>
              <CreativeShowcaseCard
                item={item}
                className="w-full"
                href={`${pathname}?${PIECE_PARAM}=${encodeURIComponent(item.id)}`}
                onOpen={() => openAt(index)}
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
          onChangeIndex={changeIndex}
          sharePath={pathname}
        />
      )}
    </>
  );
}

export function CreativeShowcaseGrid({
  items,
}: {
  items: CreativeShowcaseItem[];
}) {
  return (
    <Suspense
      fallback={
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
      }
    >
      <CreativeShowcaseGridInner items={items} />
    </Suspense>
  );
}
