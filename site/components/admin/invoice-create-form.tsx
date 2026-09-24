"use client";

import { useMemo, useState } from "react";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmit } from "@/components/admin/admin-submit";
import { AdminField, AdminTextarea } from "@/components/admin/form";
import { createInvoiceAction } from "@/lib/admin/invoice-actions";
import {
  calculateInvoiceAmount,
  formatMoney,
  type InvoiceRateType,
} from "@/lib/invoices";

export function InvoiceCreateForm() {
  const [rateType, setRateType] = useState<InvoiceRateType>("hourly");
  const [rate, setRate] = useState("");
  const [hours, setHours] = useState("");

  const total = useMemo(() => {
    const r = Number(rate);
    const h = Number(hours);
    return calculateInvoiceAmount(
      rateType,
      Number.isFinite(r) ? r : 0,
      Number.isFinite(h) ? h : 0,
    );
  }, [rateType, rate, hours]);

  return (
    <AdminForm
      action={createInvoiceAction}
      successMessage="Invoice created"
      alwaysEnableSubmit
      className="mt-8 space-y-8"
    >
      <section className="grid gap-6 border border-white/10 p-6 sm:grid-cols-2">
        <AdminField label="Client name" name="clientName" required />
        <AdminField
          label="Client email"
          name="clientEmail"
          type="email"
          required
        />
      </section>

      <section className="border border-white/10 p-6">
        <AdminTextarea
          label="Description of services"
          name="description"
          rows={5}
          required
          hint="What you delivered — line items, scope, or a short summary."
        />
      </section>

      <section className="space-y-6 border border-white/10 p-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#737373]">
            Rate type
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                { id: "hourly", label: "Hourly" },
                { id: "fixed", label: "Fixed" },
              ] as const
            ).map((opt) => (
              <label
                key={opt.id}
                className={`cursor-pointer border px-4 py-2 text-sm transition-colors ${
                  rateType === opt.id
                    ? "border-[#ff453a] bg-[#ff453a]/15 text-white"
                    : "border-white/10 text-[#a3a3a3] hover:border-white/30"
                }`}
              >
                <input
                  type="radio"
                  name="rateType"
                  value={opt.id}
                  checked={rateType === opt.id}
                  onChange={() => setRateType(opt.id)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-[#737373]">
              {rateType === "hourly" ? "Hourly rate (USD)" : "Fixed fee (USD)"}
            </span>
            <input
              type="number"
              name="rate"
              min="0"
              step="0.01"
              required
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="mt-1.5 w-full border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
              placeholder="0.00"
            />
          </label>

          {rateType === "hourly" ? (
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-[#737373]">
                Hours spent
              </span>
              <input
                type="number"
                name="hours"
                min="0"
                step="0.25"
                required
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="mt-1.5 w-full border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
                placeholder="0"
              />
            </label>
          ) : (
            <input type="hidden" name="hours" value="" />
          )}
        </div>

        <div className="flex items-end justify-between border-t border-white/10 pt-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#737373]">
              Total due
            </p>
            <p className="mt-1 font-mono text-3xl text-white">
              {formatMoney(total)}
            </p>
            {rateType === "hourly" && Number(rate) > 0 && Number(hours) > 0 ? (
              <p className="mt-1 text-xs text-[#525252]">
                {formatMoney(Number(rate))} × {hours} hrs
              </p>
            ) : null}
          </div>
          <AdminSubmit label="Create invoice" pendingLabel="Creating…" />
        </div>
      </section>

      <section className="border border-white/10 p-6">
        <AdminTextarea
          label="Notes (optional)"
          name="notes"
          rows={3}
          hint="Shown on the invoice under payment options."
        />
      </section>
    </AdminForm>
  );
}
