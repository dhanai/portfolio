"use client";

import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmit } from "@/components/admin/admin-submit";
import { AdminField, AdminTextarea } from "@/components/admin/form";
import { ProposalListEditor } from "@/components/admin/proposal-list-editor";
import type { ActionResult } from "@/lib/admin/types";
import {
  DEFAULT_PAYMENT_SCHEDULE,
  DEFAULT_TERMS,
  defaultNextSteps,
} from "@/lib/proposals";

export type ProposalFormValues = {
  id?: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  title: string;
  goals: string;
  deliverables: string[];
  timeframe: string;
  quoteLabel: string;
  amount: string;
  paymentSchedule: string;
  nextSteps: string[];
  terms: string;
  notes: string;
};

export function ProposalForm({
  action,
  initial,
  submitLabel,
  pendingLabel,
  successMessage,
}: {
  action: (formData: FormData) => Promise<ActionResult | void>;
  initial?: Partial<ProposalFormValues>;
  submitLabel: string;
  pendingLabel: string;
  successMessage: string;
}) {
  return (
    <AdminForm
      action={action}
      successMessage={successMessage}
      alwaysEnableSubmit
      className="mt-8 space-y-8"
    >
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      <section className="grid gap-6 border border-white/10 p-6 sm:grid-cols-2">
        <AdminField
          label="Client name"
          name="clientName"
          required
          defaultValue={initial?.clientName ?? ""}
        />
        <AdminField
          label="Company (optional)"
          name="clientCompany"
          defaultValue={initial?.clientCompany ?? ""}
        />
        <AdminField
          label="Client email"
          name="clientEmail"
          type="email"
          required
          defaultValue={initial?.clientEmail ?? ""}
        />
        <AdminField
          label="Project title"
          name="title"
          required
          defaultValue={initial?.title ?? ""}
          hint='e.g. "Web Design & Development"'
        />
      </section>

      <section className="space-y-6 border border-white/10 p-6">
        <AdminTextarea
          label="Goals & objectives (optional)"
          name="goals"
          rows={4}
          defaultValue={initial?.goals ?? ""}
          hint="Hidden on the client page when empty."
        />
        <ProposalListEditor
          name="deliverablesJson"
          label="Deliverables"
          hint="Bullet list shown on the proposal."
          addLabel="Deliverable"
          initialItems={initial?.deliverables}
        />
        <AdminField
          label="Timeframe"
          name="timeframe"
          required
          defaultValue={initial?.timeframe ?? ""}
          hint='e.g. "2–3 weeks"'
        />
      </section>

      <section className="grid gap-6 border border-white/10 p-6 sm:grid-cols-2">
        <AdminField
          label="Quote label"
          name="quoteLabel"
          required
          defaultValue={initial?.quoteLabel ?? ""}
          hint='e.g. "Website design with revisions"'
        />
        <AdminField
          label="Amount (USD)"
          name="amount"
          type="number"
          required
          defaultValue={initial?.amount ?? ""}
        />
        <div className="sm:col-span-2">
          <AdminTextarea
            label="Payment schedule"
            name="paymentSchedule"
            rows={3}
            defaultValue={
              initial?.paymentSchedule ?? DEFAULT_PAYMENT_SCHEDULE
            }
          />
        </div>
      </section>

      <section className="space-y-6 border border-white/10 p-6">
        <ProposalListEditor
          name="nextStepsJson"
          label="Next steps"
          addLabel="Step"
          initialItems={initial?.nextSteps ?? defaultNextSteps()}
        />
        <AdminTextarea
          label="Terms & conditions"
          name="terms"
          rows={8}
          defaultValue={initial?.terms ?? DEFAULT_TERMS}
        />
        <AdminTextarea
          label="Notes (optional)"
          name="notes"
          rows={3}
          defaultValue={initial?.notes ?? ""}
        />
      </section>

      <div className="flex justify-end">
        <AdminSubmit label={submitLabel} pendingLabel={pendingLabel} />
      </div>
    </AdminForm>
  );
}
