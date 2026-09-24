"use client";

import { useState } from "react";
import {
  DragHandle,
  SortableDropRow,
  useDragReorder,
} from "@/components/admin/drag-reorder";

function createItemId() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

type ListItem = { id: string; value: string };

function toItems(initial: string[] | undefined): ListItem[] {
  const values = (initial ?? []).filter((v) => v.trim());
  if (values.length === 0) {
    return [{ id: createItemId(), value: "" }];
  }
  return values.map((value) => ({ id: createItemId(), value }));
}

export function ProposalListEditor({
  name,
  label,
  hint,
  initialItems,
  addLabel = "Add item",
}: {
  name: string;
  label: string;
  hint?: string;
  initialItems?: string[];
  addLabel?: string;
}) {
  const [items, setItems] = useState<ListItem[]>(() => toItems(initialItems));

  const drag = useDragReorder((from, to) => {
      setItems((prev) => {
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
      });
    });

  const payload = JSON.stringify(
    items.map((item) => item.value.trim()).filter(Boolean),
  );

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#737373]">
            {label}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-[#525252]">{hint}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() =>
            setItems((prev) => [...prev, { id: createItemId(), value: "" }])
          }
          className="text-xs uppercase tracking-wider text-[#a3a3a3] hover:text-white"
        >
          + {addLabel}
        </button>
      </div>

      <input type="hidden" name={name} value={payload} readOnly />

      <ul className="space-y-2">
        {items.map((item, index) => (
          <SortableDropRow
            key={item.id}
            index={index}
            drag={drag}
            className="flex items-start gap-2 border border-white/10 bg-black/20 p-2"
          >
            <div className="pt-2.5">
              <DragHandle
                index={index}
                onDragStart={drag.handleDragStart}
                onDragEnd={drag.handleDragEnd}
              />
            </div>
            <textarea
              rows={2}
              value={item.value}
              onChange={(event) => {
                const value = event.target.value;
                setItems((prev) =>
                  prev.map((row) =>
                    row.id === item.id ? { ...row, value } : row,
                  ),
                );
              }}
              className="min-w-0 flex-1 resize-y border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
              placeholder="Item…"
            />
            <button
              type="button"
              onClick={() =>
                setItems((prev) =>
                  prev.length <= 1
                    ? [{ id: createItemId(), value: "" }]
                    : prev.filter((row) => row.id !== item.id),
                )
              }
              className="shrink-0 px-2 py-2 text-xs text-[#737373] hover:text-[#ff453a]"
              aria-label="Remove item"
            >
              Remove
            </button>
          </SortableDropRow>
        ))}
      </ul>
    </div>
  );
}
