"use client";

import { ProposalForm } from "@/components/admin/proposal-form";
import { createProposalAction } from "@/lib/admin/proposal-actions";

export function ProposalCreateForm({ className }: { className?: string }) {
  return (
    <ProposalForm
      action={createProposalAction}
      submitLabel="Create proposal"
      pendingLabel="Creating…"
      successMessage="Proposal created"
      className={className}
    />
  );
}
