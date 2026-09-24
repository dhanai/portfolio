import Link from "next/link";
import { notFound } from "next/navigation";
import { ProposalForm } from "@/components/admin/proposal-form";
import { updateProposalAction } from "@/lib/admin/proposal-actions";
import { parseStringListJson } from "@/lib/proposals";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProposalPage({ params }: PageProps) {
  const { id } = await params;
  const proposal = await prisma.proposal.findUnique({ where: { id } });
  if (!proposal) notFound();

  return (
    <div>
      <div className="mb-2">
        <Link
          href={`/admin/proposals/${proposal.id}`}
          className="text-xs uppercase tracking-wider text-[#737373] hover:text-white"
        >
          ← {proposal.number}
        </Link>
      </div>
      <h1 className="text-2xl font-medium">Edit proposal</h1>
      <p className="mt-2 text-sm text-[#737373]">
        Changes update the same client link — no new URL.
      </p>
      <ProposalForm
        action={updateProposalAction}
        submitLabel="Save changes"
        pendingLabel="Saving…"
        successMessage="Proposal saved"
        initial={{
          id: proposal.id,
          clientName: proposal.clientName,
          clientCompany: proposal.clientCompany,
          clientEmail: proposal.clientEmail,
          title: proposal.title,
          goals: proposal.goals ?? "",
          deliverables: parseStringListJson(proposal.deliverables),
          timeframe: proposal.timeframe,
          quoteLabel: proposal.quoteLabel,
          amount: String(proposal.amount),
          paymentSchedule: proposal.paymentSchedule,
          nextSteps: parseStringListJson(proposal.nextSteps),
          terms: proposal.terms,
          notes: proposal.notes ?? "",
        }}
      />
    </div>
  );
}
