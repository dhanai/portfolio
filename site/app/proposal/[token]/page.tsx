import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  formatMoney,
  formatProposalDate,
  nextStepsIntro,
  parseStringListJson,
  PROPOSAL_ISSUER,
  proposalPdfFilename,
  proposalPdfPath,
  proposalStatusLabel,
} from "@/lib/proposals";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ token: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { token } = await params;
  const proposal = await prisma.proposal.findUnique({ where: { token } });
  if (!proposal) {
    return {
      title: { absolute: "Proposal" },
      robots: { index: false, follow: false },
    };
  }

  const title = `Proposal ${proposal.number}`;
  const clientLabel = proposal.clientCompany || proposal.clientName;
  const description = `${proposal.title} for ${clientLabel} — ${formatMoney(proposal.amount)}. Prepared by ${PROPOSAL_ISSUER.name}.`;
  const path = `/proposal/${token}`;

  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: path,
      siteName: PROPOSAL_ISSUER.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicProposalPage({ params }: PageProps) {
  const { token } = await params;
  const proposal = await prisma.proposal.findUnique({ where: { token } });
  if (!proposal) notFound();

  const deliverables = parseStringListJson(proposal.deliverables);
  const nextSteps = parseStringListJson(proposal.nextSteps);
  const clientLabel = proposal.clientCompany || proposal.clientName;
  const statusLabel = proposalStatusLabel(proposal.status);
  const paymentLines = proposal.paymentSchedule
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-[#111111]">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-14">
        <article className="border border-[#e4e4e7] bg-white shadow-sm">
          <header className="flex flex-col gap-6 border-b border-[#e4e4e7] px-5 py-6 sm:flex-row sm:items-start sm:justify-between sm:px-8 sm:py-8">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#71717a]">
                Project proposal
              </p>
              <h1 className="mt-2 text-xl font-medium tracking-tight sm:text-2xl">
                {proposal.title}
              </h1>
              <p className="mt-2 font-mono text-sm text-[#52525b]">
                {proposal.number}
              </p>
              <p className="mt-1 text-sm text-[#52525b]">
                {formatProposalDate(proposal.createdAt)}
              </p>
              <a
                href={proposalPdfPath(proposal.token)}
                download={proposalPdfFilename(proposal.number)}
                className="mt-4 inline-flex items-center border border-[#18181b] bg-[#18181b] px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-white hover:bg-[#27272a]"
              >
                Download proposal
              </a>
            </div>
            <div className="sm:text-right">
              <p
                className={`inline-block text-[10px] font-medium uppercase tracking-[0.16em] ${
                  proposal.status === "accepted"
                    ? "text-emerald-700"
                    : proposal.status === "declined"
                      ? "text-[#b91c1c]"
                      : "text-[#71717a]"
                }`}
              >
                {statusLabel}
              </p>
              <p className="mt-1 font-mono text-3xl font-medium tracking-tight sm:text-4xl">
                {formatMoney(proposal.amount)}
              </p>
            </div>
          </header>

          <section className="grid gap-8 border-b border-[#e4e4e7] px-5 py-6 sm:grid-cols-2 sm:px-8 sm:py-8">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#a1a1aa]">
                From
              </p>
              <p className="mt-2 text-sm font-medium">{PROPOSAL_ISSUER.name}</p>
              {PROPOSAL_ISSUER.addressLines.map((line) => (
                <p key={line} className="text-sm text-[#52525b]">
                  {line}
                </p>
              ))}
              <p className="mt-1 text-sm text-[#52525b]">
                {PROPOSAL_ISSUER.email}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#a1a1aa]">
                Prepared for
              </p>
              <p className="mt-2 text-sm font-medium">{proposal.clientName}</p>
              {proposal.clientCompany ? (
                <p className="text-sm text-[#52525b]">{proposal.clientCompany}</p>
              ) : null}
              <p className="text-sm text-[#52525b]">{proposal.clientEmail}</p>
            </div>
          </section>

          {proposal.goals ? (
            <section className="border-b border-[#e4e4e7] px-5 py-6 sm:px-8 sm:py-8">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#a1a1aa]">
                Goals &amp; objectives
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#27272a]">
                {proposal.goals}
              </p>
            </section>
          ) : null}

          <section className="border-b border-[#e4e4e7] px-5 py-6 sm:px-8 sm:py-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#a1a1aa]">
                  Deliverables
                </p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-[#27272a]">
                  {deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#a1a1aa]">
                  Timeframe
                </p>
                <p className="mt-3 text-sm font-medium text-[#18181b]">
                  {proposal.timeframe}
                </p>
              </div>
            </div>
          </section>

          <section className="border-b border-[#e4e4e7] px-5 py-6 sm:px-8 sm:py-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#a1a1aa]">
              Quote — flat rate
            </p>
            <div className="mt-4 flex flex-col gap-1 border border-[#e4e4e7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#27272a]">{proposal.quoteLabel}</p>
              <p className="font-mono text-lg font-medium">
                {formatMoney(proposal.amount)}
              </p>
            </div>
            {paymentLines.length > 0 ? (
              <div className="mt-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#71717a]">
                  Payment schedule
                </p>
                <ul className="mt-2 space-y-1 text-sm text-[#52525b]">
                  {paymentLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          <section className="border-b border-[#e4e4e7] px-5 py-6 sm:px-8 sm:py-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#a1a1aa]">
              Next steps
            </p>
            <p className="mt-3 text-sm text-[#52525b]">
              {nextStepsIntro(clientLabel)}
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[#27272a]">
              {nextSteps.map((step) => (
                <li key={step} className="pl-1">
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <section className="px-5 py-6 sm:px-8 sm:py-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#a1a1aa]">
              Terms &amp; conditions
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#52525b]">
              {proposal.terms}
            </p>
            {proposal.notes ? (
              <p className="mt-5 whitespace-pre-wrap text-sm text-[#52525b]">
                {proposal.notes}
              </p>
            ) : null}
          </section>

          <footer className="border-t border-[#e4e4e7] px-5 py-4 text-center text-[11px] text-[#a1a1aa] sm:px-8">
            Prepared by {PROPOSAL_ISSUER.name} · {proposal.number}
          </footer>
        </article>
      </div>
    </div>
  );
}
