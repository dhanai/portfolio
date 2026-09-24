"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DragHandle,
  SortableDropRow,
  useDragReorder,
} from "@/components/admin/drag-reorder";
import { notifyFormChanged, reorderList } from "@/lib/admin/reorder-list";
import {
  calculateLineAmount,
  createLineItemId,
  emptyLineItem,
  formatMoney,
  type InvoiceLineItem,
  type InvoiceRateType,
  sumLineItems,
} from "@/lib/invoices";

function withAmount(item: InvoiceLineItem): InvoiceLineItem {
  return {
    ...item,
    amount: calculateLineAmount(item.rateType, item.rate, item.hours),
  };
}

export function InvoiceLineItemsEditor({
  initialItems,
}: {
  initialItems?: InvoiceLineItem[];
}) {
  const [items, setItems] = useState<InvoiceLineItem[]>(() => {
    if (initialItems && initialItems.length > 0) {
      return initialItems.map(withAmount);
    }
    return [withAmount(emptyLineItem())];
  });

  const total = useMemo(() => sumLineItems(items), [items]);

  const updateItems = useCallback((next: InvoiceLineItem[]) => {
    setItems(next.map(withAmount));
  }, []);

  const onReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      updateItems(reorderList(items, fromIndex, toIndex));
    },
    [items, updateItems],
  );

  const drag = useDragReorder(onReorder);

  function patchItem(id: string, patch: Partial<InvoiceLineItem>) {
    updateItems(
      items.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, ...patch };
        if (patch.rateType === "fixed") next.hours = null;
        return next;
      }),
    );
  }

  function removeItem(id: string) {
    if (items.length <= 1) {
      updateItems([withAmount(emptyLineItem())]);
      return;
    }
    updateItems(items.filter((item) => item.id !== id));
  }

  function addItem() {
    updateItems([
      ...items,
      withAmount({ ...emptyLineItem(), id: createLineItemId() }),
    ]);
  }

  return (
    <section className="space-y-4 border border-white/10 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xs uppercase tracking-wider text-[#737373]">
            Line items
          </h2>
          <p className="mt-1 text-xs text-[#525252]">
            Add, edit, remove, and drag to reorder. Each row is a line on the
            invoice.
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="shrink-0 border border-white/20 px-3 py-1.5 text-xs uppercase tracking-wider text-white hover:border-white/40"
        >
          + Add line
        </button>
      </div>

      <input
        type="hidden"
        name="lineItemsJson"
        value={JSON.stringify(items)}
        readOnly
      />

      <div className="space-y-3">
        {items.map((item, index) => (
          <SortableDropRow
            key={item.id}
            index={index}
            drag={drag}
            className="border border-white/10 bg-[#0a0a0a]"
          >
            <div className="flex gap-3 p-4">
              <div className="pt-2">
                <DragHandle
                  index={index}
                  onDragStart={drag.handleDragStart}
                  onDragEnd={drag.handleDragEnd}
                  label={`Reorder line ${index + 1}`}
                />
              </div>

              <div className="min-w-0 flex-1 space-y-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-[#737373]">
                    Description
                  </span>
                  <textarea
                    rows={3}
                    required
                    value={item.description}
                    onChange={(e) => {
                      patchItem(item.id, { description: e.target.value });
                      notifyFormChanged(e.currentTarget);
                    }}
                    className="mt-1.5 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
                    placeholder="What this line covers"
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { id: "hourly", label: "Hourly" },
                      { id: "fixed", label: "Fixed" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={(e) => {
                        patchItem(item.id, {
                          rateType: opt.id as InvoiceRateType,
                        });
                        notifyFormChanged(e.currentTarget);
                      }}
                      className={`border px-3 py-1.5 text-xs uppercase tracking-wider ${
                        item.rateType === opt.id
                          ? "border-[#ff453a] bg-[#ff453a]/15 text-white"
                          : "border-white/10 text-[#a3a3a3] hover:border-white/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-[#737373]">
                      {item.rateType === "hourly" ? "Rate (USD/hr)" : "Fee (USD)"}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={item.rate || ""}
                      onChange={(e) => {
                        patchItem(item.id, {
                          rate: Number(e.target.value) || 0,
                        });
                        notifyFormChanged(e.currentTarget);
                      }}
                      className="mt-1.5 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
                    />
                  </label>

                  {item.rateType === "hourly" ? (
                    <label className="block">
                      <span className="text-xs uppercase tracking-wider text-[#737373]">
                        Hours
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.25"
                        required
                        value={item.hours ?? ""}
                        onChange={(e) => {
                          patchItem(item.id, {
                            hours: Number(e.target.value) || 0,
                          });
                          notifyFormChanged(e.currentTarget);
                        }}
                        className="mt-1.5 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
                      />
                    </label>
                  ) : (
                    <div className="hidden sm:block" />
                  )}

                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#737373]">
                      Line total
                    </p>
                    <p className="mt-2 font-mono text-lg text-white">
                      {formatMoney(item.amount)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  removeItem(item.id);
                  notifyFormChanged(e.currentTarget);
                }}
                className="shrink-0 self-start text-xs uppercase tracking-wider text-[#737373] hover:text-[#ff453a]"
                aria-label={`Remove line ${index + 1}`}
              >
                Remove
              </button>
            </div>
          </SortableDropRow>
        ))}
      </div>

      <div className="flex items-end justify-between border-t border-white/10 pt-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#737373]">
            Invoice total
          </p>
          <p className="mt-1 font-mono text-3xl text-white">
            {formatMoney(total)}
          </p>
          <p className="mt-1 text-xs text-[#525252]">
            {items.length} line{items.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>
    </section>
  );
}
