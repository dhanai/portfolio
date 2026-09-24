import { renderToBuffer } from "@react-pdf/renderer";
import { ProposalPdfDocument } from "@/components/proposal/proposal-pdf-document";
import {
  parseStringListJson,
  proposalPdfFilename,
} from "@/lib/proposals";

export type ProposalPdfSource = {
  number: string;
  title: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  goals: string | null;
  deliverables: string;
  timeframe: string;
  quoteLabel: string;
  amount: number;
  paymentSchedule: string;
  nextSteps: string;
  terms: string;
  notes: string | null;
  status: string;
  createdAt: Date;
};

export async function generateProposalPdf(
  proposal: ProposalPdfSource,
): Promise<{ buffer: Buffer; filename: string }> {
  const buffer = await renderToBuffer(
    <ProposalPdfDocument
      number={proposal.number}
      title={proposal.title}
      clientName={proposal.clientName}
      clientCompany={proposal.clientCompany}
      clientEmail={proposal.clientEmail}
      goals={proposal.goals}
      deliverables={parseStringListJson(proposal.deliverables)}
      timeframe={proposal.timeframe}
      quoteLabel={proposal.quoteLabel}
      amount={proposal.amount}
      paymentSchedule={proposal.paymentSchedule}
      nextSteps={parseStringListJson(proposal.nextSteps)}
      terms={proposal.terms}
      notes={proposal.notes}
      status={proposal.status}
      createdAt={proposal.createdAt}
    />,
  );
  return { buffer, filename: proposalPdfFilename(proposal.number) };
}
