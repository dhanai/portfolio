"use client";

import { useCallback, useState, type DragEvent, type ReactNode } from "react";

export function DragHandle({
  index,
  onDragStart,
  onDragEnd,
  label = "Drag to reorder",
}: {
  index: number;
  onDragStart: (index: number, event: DragEvent) => void;
  onDragEnd: () => void;
  label?: string;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      draggable
      onDragStart={(event) => onDragStart(index, event)}
      onDragEnd={onDragEnd}
      className="flex shrink-0 cursor-grab touch-none items-center justify-center text-[#525252] hover:text-white active:cursor-grabbing"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="5" cy="4" r="1.25" />
        <circle cx="11" cy="4" r="1.25" />
        <circle cx="5" cy="8" r="1.25" />
        <circle cx="11" cy="8" r="1.25" />
        <circle cx="5" cy="12" r="1.25" />
        <circle cx="11" cy="12" r="1.25" />
      </svg>
    </div>
  );
}

export function useDragReorder(onReorder: (fromIndex: number, toIndex: number) => void) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number, event: DragEvent) => {
    setDragIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
  }, []);

  const handleDragOver = useCallback((index: number, event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (index: number, event: DragEvent) => {
      event.preventDefault();
      const fromIndex = Number(event.dataTransfer.getData("text/plain"));
      setDragIndex(null);
      setOverIndex(null);
      if (!Number.isNaN(fromIndex) && fromIndex !== index) {
        onReorder(fromIndex, index);
      }
    },
    [onReorder],
  );

  function getRowClassName(index: number, baseClassName = "") {
    const isDragging = dragIndex === index;
    const isOver = overIndex === index && dragIndex !== null && dragIndex !== index;
    return [
      baseClassName,
      isDragging ? "opacity-50" : "",
      isOver ? "ring-1 ring-[#ff453a]" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return {
    dragIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    getRowClassName,
  };
}

export function SortableDropRow({
  index,
  drag,
  className,
  children,
}: {
  index: number;
  drag: ReturnType<typeof useDragReorder>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={drag.getRowClassName(index, className)}
      onDragOver={(event) => drag.handleDragOver(index, event)}
      onDragLeave={drag.handleDragLeave}
      onDrop={(event) => drag.handleDrop(index, event)}
    >
      {children}
    </div>
  );
}
