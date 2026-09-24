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
import { richTextIsEmpty, sanitizeRichText } from "@/lib/rich-text";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ token: string }>;
};

const h1 =
  "text-3xl font-medium leading-tight tracking-[-0.03em] text-[#12181e]";
const h3 = "text-sm font-medium text-[#12181e]";
const p = "text-sm leading-relaxed text-[#3d4a55]";

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

function SectionHeading({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <h3 className={`${h3} mb-4`}>
      <span className="mr-2 font-mono text-[#6b7c8a]">{index}</span>
      {children}
    </h3>
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
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <p className={p}>
            Proposal ·{" "}
            <span className="font-mono text-[#1a2229]">{proposal.number}</span>
          </p>
          <div className="flex items-center gap-4">
            <p
              className={`${p} ${
                proposal.status === "accepted"
                  ? "text-emerald-800"
                  : proposal.status === "declined"
                    ? "text-[#9f1239]"
                    : ""
              }`}
            >
              {statusLabel}
            </p>
            <a
              href={proposalPdfPath(proposal.token)}
              download={proposalPdfFilename(proposal.number)}
              className={`${p} border-b border-[#1a2229]/35 pb-0.5 text-[#1a2229] transition-opacity hover:opacity-60`}
            >
              Download PDF
            </a>
          </div>
        </div>

        <header className="max-w-2xl animate-[proposalFade_0.7s_ease-out]">
          <p className={p}>
            Prepared for {clientLabel} · {formatProposalDate(proposal.createdAt)}
          </p>
          <h1 className={`${h1} mt-3`}>{proposal.title}</h1>
        </header>

        <div className="mt-10 grid gap-8 border-y border-[#1a2229]/12 py-8 sm:grid-cols-2">
          <div>
            <h3 className={h3}>From</h3>
            <p className={`${p} mt-2 text-[#1a2229]`}>{PROPOSAL_ISSUER.name}</p>
            {PROPOSAL_ISSUER.addressLines.map((line) => (
              <p key={line} className={p}>
                {line}
              </p>
            ))}
            <p className={p}>{PROPOSAL_ISSUER.email}</p>
          </div>
          <div>
            <h3 className={h3}>Prepared for</h3>
            <p className={`${p} mt-2 text-[#1a2229]`}>{proposal.clientName}</p>
            {proposal.clientCompany ? (
              <p className={p}>{proposal.clientCompany}</p>
            ) : null}
            <p className={p}>{proposal.clientEmail}</p>
          </div>
        </div>

        <div className="mt-12 space-y-12">
          {!richTextIsEmpty(proposal.goals) ? (
            <section>
              <SectionHeading index={nextIndex()}>
                Goals &amp; objectives
              </SectionHeading>
              <div
                className={`${p} [&_b]:font-semibold [&_strong]:font-semibold [&_em]:italic [&_i]:italic [&_u]:underline [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5`}
                dangerouslySetInnerHTML={{
                  __html: sanitizeRichText(proposal.goals),
                }}
              />
            </section>
          ) : null}

          <section>
            <SectionHeading index={nextIndex()}>Scope</SectionHeading>
            <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr]">
              <div>
                <h3 className={h3}>Deliverables</h3>
                <ul className="mt-3 space-y-2">
                  {deliverables.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1fa89a]"
                      />
                      <p className={p}>{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className={h3}>Timeframe</h3>
                <p className={`${p} mt-3 text-[#1a2229]`}>{proposal.timeframe}</p>
              </div>
            </div>
          </section>

          <section>
            <SectionHeading index={nextIndex()}>Investment</SectionHeading>
            <div className="relative overflow-hidden bg-[#12181e] px-6 py-7 text-[#eef2f4] sm:px-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(31,168,154,0.35)_0%,transparent_70%)]"
              />
              <h3 className={`${h3} relative text-[#eef2f4]`}>Flat rate</h3>
              <div className="relative mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <p className={`${p} max-w-md text-[#c5d0d8]`}>
                  {proposal.quoteLabel}
                </p>
                <p className={`${h3} font-mono text-[#eef2f4]`}>
                  {formatMoney(proposal.amount)}
                </p>
              </div>
              {paymentLines.length > 0 ? (
                <ul className="relative mt-6 space-y-1 border-t border-white/10 pt-4">
                  {paymentLines.map((line) => (
                    <li key={line}>
                      <p className={`${p} text-[#a8b6c1]`}>{line}</p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>

          <section>
            <SectionHeading index={nextIndex()}>Next steps</SectionHeading>
            <p className={`${p} max-w-2xl`}>{nextStepsIntro(clientLabel)}</p>
            <ol className="mt-5 space-y-4">
              {nextSteps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <p className={`${p} w-6 shrink-0 font-mono text-[#1fa89a]`}>
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className={p}>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <SectionHeading index={nextIndex()}>
              Terms &amp; conditions
            </SectionHeading>
            <p className={`${p} whitespace-pre-wrap`}>{proposal.terms}</p>
            {proposal.notes ? (
              <p className={`${p} mt-4 whitespace-pre-wrap`}>{proposal.notes}</p>
            ) : null}
          </section>
        </div>

        <footer className="mt-14 flex flex-col gap-1 border-t border-[#1a2229]/12 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className={p}>
            Prepared by{" "}
            <span className="text-[#1a2229]">{PROPOSAL_ISSUER.name}</span>
          </p>
          <p className={`${p} font-mono`}>{proposal.number}</p>
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
