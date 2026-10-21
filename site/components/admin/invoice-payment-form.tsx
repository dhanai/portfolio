"use client";

import { useState } from "react";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmit } from "@/components/admin/admin-submit";
import { recordInvoicePaymentAction } from "@/lib/admin/invoice-actions";
import {
  formatMoney,
  formatWorkedOn,
  roundMoney,
  type InvoiceLineItem,
} from "@/lib/invoices";

function toInput(n: number) {
  return n > 0 ? n.toFixed(2) : "";
}

export function InvoicePaymentForm({
  invoiceId,
  total,
  amountPaid,
  lineItems,
}: {
  invoiceId: string;
  total: number;
  amountPaid: number;
  lineItems: InvoiceLineItem[];
}) {
  const [checked, setChecked] = useState(
    () => new Set(lineItems.filter((item) => item.paid).map((item) => item.id)),
  );
  const [amount, setAmount] = useState(toInput(amountPaid));

  function toggle(id: string) {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
    const sum = roundMoney(
      lineItems
        .filter((item) => next.has(item.id))
        .reduce((acc, item) => acc + item.amount, 0),
    );
    setAmount(toInput(sum));
  }

  const entered = Number(amount.replace(/[$,]/g, ""));
  const paidNow = amount.trim() && Number.isFinite(entered) ? entered : 0;
  const balance = roundMoney(Math.max(0, total - paidNow));

  return (
    <AdminForm
      action={recordInvoicePaymentAction}
      successMessage="Payment saved"
      alwaysEnableSubmit
      className="space-y-5"
    >
      <input type="hidden" name="id" value={invoiceId} />

      {lineItems.length > 1 ? (
        <fieldset>
          <legend className="text-xs text-[#a3a3a3]">
            Which lines were paid? Optional. Checking lines fills in the amount.
          </legend>
          <ul className="mt-3 divide-y divide-white/10 border border-white/10">
            {lineItems.map((item) => (
              <li key={item.id}>
                <label className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-white/5">
                  <input
                    type="checkbox"
                    name="paidItem"
                    value={item.id}
                    checked={checked.has(item.id)}
                    onChange={() => toggle(item.id)}
                    className="mt-0.5 size-4 shrink-0 accent-emerald-500"
                  />
                  <span className="min-w-0 flex-1 text-sm text-[#d4d4d4]">
                    {item.workedOn ? (
                      <span className="font-mono text-[#737373]">
                        {formatWorkedOn(item.workedOn)} ·{" "}
                      </span>
                    ) : null}
                    {item.description}
                  </span>
                  <span className="shrink-0 font-mono text-sm text-white">
                    {formatMoney(item.amount)}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="block">
          <span className="text-xs text-[#a3a3a3]">Amount paid to date</span>
          <span className="mt-1.5 flex items-center border border-white/15 bg-black focus-within:border-white/40">
            <span className="pl-3 font-mono text-sm text-[#737373]">$</span>
            <input
              name="amountPaid"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              className="w-40 bg-transparent px-2 py-2.5 font-mono text-sm text-white outline-none"
            />
          </span>
        </label>
        <p className="pb-2.5 font-mono text-xs text-[#737373]">
          of {formatMoney(total)} · balance{" "}
          <span className={balance > 0 ? "text-white" : "text-emerald-400"}>
            {formatMoney(balance)}
          </span>
        </p>
      </div>

      <AdminSubmit label="Save payment" pendingLabel="Saving…" />
    </AdminForm>
  );
}
