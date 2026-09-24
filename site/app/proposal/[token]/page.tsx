import type { Metadata } from "next";
import type { ReactNode } from "react";
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

function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-baseline gap-3">
      <span className="font-mono text-[11px] tracking-wide text-[#6b7c8a]">
        {index}
      </span>
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3d4a55]">
        {children}
      </h2>
    </div>
  );
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

  let section = 1;
  const nextIndex = () => String(section++).padStart(2, "0");

  return (
    <div className="relative min-h-screen overflow-hidden text-[#1a2229]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#dfe6eb]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(31,168,154,0.22)_0%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-40 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(20,40,60,0.12)_0%,transparent_68%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#cfd8df]/80 to-transparent"
      />

      <div className="relative mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-3 text-[11px] tracking-[0.14em] text-[#5a6b78] uppercase">
          <p>
            Proposal ·{" "}
            <span className="font-mono normal-case tracking-normal text-[#3d4a55]">
              {proposal.number}
            </span>
          </p>
          <div className="flex items-center gap-4">
            <span
              className={
                proposal.status === "accepted"
                  ? "text-emerald-800"
                  : proposal.status === "declined"
                    ? "text-[#9f1239]"
                    : "text-[#5a6b78]"
              }
            >
              {statusLabel}
            </span>
            <a
              href={proposalPdfPath(proposal.token)}
              download={proposalPdfFilename(proposal.number)}
              className="border-b border-[#1a2229]/35 pb-0.5 text-[#1a2229] transition-opacity hover:opacity-60"
            >
              Download PDF
            </a>
          </div>
        </div>

        <header className="max-w-2xl animate-[proposalFade_0.7s_ease-out]">
          <p className="text-sm text-[#5a6b78]">
            Prepared for {clientLabel} · {formatProposalDate(proposal.createdAt)}
          </p>
          <h1 className="mt-4 text-[2.35rem] font-medium leading-[1.1] tracking-[-0.03em] text-[#12181e] sm:text-[3.1rem]">
            {proposal.title}
          </h1>
        </header>

        <div className="mt-12 grid gap-8 border-y border-[#1a2229]/12 py-8 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b7c8a]">
              From
            </p>
            <p className="mt-3 text-base font-medium">{PROPOSAL_ISSUER.name}</p>
            {PROPOSAL_ISSUER.addressLines.map((line) => (
              <p key={line} className="text-sm text-[#5a6b78]">
                {line}
              </p>
            ))}
            <p className="mt-1 text-sm text-[#5a6b78]">{PROPOSAL_ISSUER.email}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b7c8a]">
              Prepared for
            </p>
            <p className="mt-3 text-base font-medium">{proposal.clientName}</p>
            {proposal.clientCompany ? (
              <p className="text-sm text-[#5a6b78]">{proposal.clientCompany}</p>
            ) : null}
            <p className="text-sm text-[#5a6b78]">{proposal.clientEmail}</p>
          </div>
        </div>

        <div className="mt-14 space-y-14">
          {proposal.goals ? (
            <section>
              <SectionLabel index={nextIndex()}>Goals &amp; objectives</SectionLabel>
              <p className="whitespace-pre-wrap text-base leading-relaxed text-[#1f2a33] sm:text-lg">
                {proposal.goals}
              </p>
            </section>
          ) : null}

          <section>
            <SectionLabel index={nextIndex()}>Scope</SectionLabel>
            <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7c8a]">
                  Deliverables
                </p>
                <ul className="mt-4 space-y-3">
                  {deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[15px] leading-snug text-[#1f2a33]"
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1fa89a]"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7c8a]">
                  Timeframe
                </p>
                <p className="mt-4 text-2xl font-medium tracking-tight text-[#12181e]">
                  {proposal.timeframe}
                </p>
              </div>
            </div>
          </section>

          <section>
            <SectionLabel index={nextIndex()}>Investment</SectionLabel>
            <div className="relative overflow-hidden bg-[#12181e] px-6 py-8 text-[#eef2f4] sm:px-8 sm:py-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(31,168,154,0.35)_0%,transparent_70%)]"
              />
              <p className="relative text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa0ad]">
                Flat rate
              </p>
              <div className="relative mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-md text-base leading-snug text-[#d5dde3]">
                  {proposal.quoteLabel}
                </p>
                <p className="font-mono text-3xl font-medium tracking-tight sm:text-4xl">
                  {formatMoney(proposal.amount)}
                </p>
              </div>
              {paymentLines.length > 0 ? (
                <ul className="relative mt-8 space-y-1.5 border-t border-white/10 pt-5 text-sm text-[#a8b6c1]">
                  {paymentLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>

          <section>
            <SectionLabel index={nextIndex()}>Next steps</SectionLabel>
            <p className="max-w-2xl text-[15px] leading-relaxed text-[#5a6b78]">
              {nextStepsIntro(clientLabel)}
            </p>
            <ol className="mt-8 space-y-6">
              {nextSteps.map((step, index) => (
                <li key={step} className="flex gap-5">
                  <span className="w-10 shrink-0 font-mono text-lg font-medium text-[#1fa89a]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-1 text-[15px] leading-relaxed text-[#1f2a33]">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <SectionLabel index={nextIndex()}>Terms &amp; conditions</SectionLabel>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#5a6b78]">
              {proposal.terms}
            </p>
            {proposal.notes ? (
              <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-[#5a6b78]">
                {proposal.notes}
              </p>
            ) : null}
          </section>
        </div>

        <footer className="mt-16 flex flex-col gap-2 border-t border-[#1a2229]/12 pt-6 text-sm text-[#6b7c8a] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Prepared by{" "}
            <span className="text-[#1a2229]">{PROPOSAL_ISSUER.name}</span>
          </p>
          <p className="font-mono text-xs">{proposal.number}</p>
        </footer>
      </div>

      <style>{`
        @keyframes proposalFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
