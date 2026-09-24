"use client";

import { ProposalForm } from "@/components/admin/proposal-form";
import { createProposalAction } from "@/lib/admin/proposal-actions";

export function ProposalCreateForm() {
  return (
    <ProposalForm
      action={createProposalAction}
      submitLabel="Create proposal"
      pendingLabel="Creating…"
      successMessage="Proposal created"
    />
  );
}
