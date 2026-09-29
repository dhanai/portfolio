"use client";

import { useEffect, useRef } from "react";

/** Sideways wheel moves the rail. Vertical wheel keeps scrolling the page. */
export function useHorizontalRailWheel<T extends HTMLElement>() {
  const railRef = useRef<T>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const pixels = (event: WheelEvent, delta: number) => {
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return delta * 16;
      if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        return delta * window.innerHeight;
      }
      return delta;
    };

    const onWheel = (event: WheelEvent) => {
      const horizontal =
        event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);

      if (!horizontal) {
        if (event.deltaY === 0) return;
        event.preventDefault();
        window.scrollBy(0, pixels(event, event.deltaY));
        return;
      }

      const delta = pixels(
        event,
        event.shiftKey ? event.deltaY : event.deltaX,
      );
      const max = rail.scrollWidth - rail.clientWidth;
      const next = Math.min(max, Math.max(0, rail.scrollLeft + delta));
      if (next === rail.scrollLeft) return;

      rail.scrollLeft = next;
      event.preventDefault();
    };

    rail.addEventListener("wheel", onWheel, { passive: false });
    return () => rail.removeEventListener("wheel", onWheel);
  }, []);

  return railRef;
}
