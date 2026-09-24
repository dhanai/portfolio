import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmit } from "@/components/admin/admin-submit";
import { CopyShareLink } from "@/components/admin/copy-share-link";
import {
  deleteProposalAction,
  markProposalAcceptedAction,
  markProposalDeclinedAction,
} from "@/lib/admin/proposal-actions";
import {
  formatMoney,
  formatProposalDate,
  parseStringListJson,
  proposalPublicPath,
  proposalStatusClass,
} from "@/lib/proposals";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; saved?: string }>;
};

export default async function AdminProposalDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { created, saved } = await searchParams;
  const proposal = await prisma.proposal.findUnique({ where: { id } });
  if (!proposal) notFound();

  const path = proposalPublicPath(proposal.token);
  const absoluteUrl = `${siteConfig.url}${path}`;
  const deliverables = parseStringListJson(proposal.deliverables);

  return (
    <div>
      <div className="mb-2">
        <Link
          href="/admin/proposals"
          className="text-xs uppercase tracking-wider text-[#737373] hover:text-white"
        >
          ← Proposals
        </Link>
      </div>

      {created ? (
        <div className="mb-6 border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Proposal created. Copy the link below and send it to your client.
        </div>
      ) : null}
      {saved ? (
        <div className="mb-6 border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Proposal saved. The client link shows the updated details.
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium">
            {proposal.clientCompany || proposal.clientName}
          </h1>
          <p className="mt-1 font-mono text-sm text-[#a3a3a3]">
            {proposal.number}
          </p>
          <p className="mt-2 text-sm text-[#737373]">
            {proposal.title} · {formatProposalDate(proposal.createdAt)} ·{" "}
            <span className={proposalStatusClass(proposal.status)}>
              {proposal.status}
            </span>
          </p>
        </div>
        <p className="font-mono text-3xl text-white">
          {formatMoney(proposal.amount)}
        </p>
      </div>

      <section className="mt-8 space-y-3 border border-white/10 p-6">
        <h2 className="text-xs uppercase tracking-wider text-[#737373]">
          Client link
        </h2>
        <CopyShareLink url={absoluteUrl} path={path} />
        <p className="text-xs text-[#525252]">
          Anyone with the link can view the proposal — no login required.
        </p>
      </section>

      <section className="mt-6 border border-white/10 p-6 text-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#737373]">
              Client
            </p>
            <p className="mt-1 text-white">{proposal.clientName}</p>
            {proposal.clientCompany ? (
              <p className="text-[#a3a3a3]">{proposal.clientCompany}</p>
            ) : null}
            <p className="text-[#a3a3a3]">{proposal.clientEmail}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-[#737373]">
              Scope
            </p>
            <p className="mt-1 text-white">
              {deliverables.length} deliverable
              {deliverables.length === 1 ? "" : "s"} · {proposal.timeframe}
            </p>
            <p className="mt-1 text-[#a3a3a3]">{proposal.quoteLabel}</p>
          </div>
        </div>
        <ul className="mt-6 list-disc space-y-1 border border-white/10 px-8 py-4 text-[#d4d4d4]">
          {deliverables.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/admin/proposals/${proposal.id}/edit`}
          className="inline-flex items-center justify-center bg-white px-5 py-2.5 text-sm font-medium text-black hover:opacity-90"
        >
          Edit
        </Link>
        {proposal.status !== "accepted" ? (
          <AdminForm
            action={markProposalAcceptedAction}
            successMessage="Marked accepted"
            alwaysEnableSubmit
          >
            <input type="hidden" name="id" value={proposal.id} />
            <AdminSubmit label="Mark accepted" pendingLabel="Updating…" />
          </AdminForm>
        ) : null}
        {proposal.status !== "declined" ? (
          <AdminForm
            action={markProposalDeclinedAction}
            successMessage="Marked declined"
            alwaysEnableSubmit
          >
            <input type="hidden" name="id" value={proposal.id} />
            <button
              type="submit"
              className="border border-white/20 px-5 py-2.5 text-sm text-[#a3a3a3] hover:border-white/40 hover:text-white"
            >
              Mark declined
            </button>
          </AdminForm>
        ) : null}
        <AdminForm
          action={deleteProposalAction}
          successMessage="Deleted"
          alwaysEnableSubmit
        >
          <input type="hidden" name="id" value={proposal.id} />
          <button
            type="submit"
            className="border border-white/20 px-5 py-2.5 text-sm text-[#a3a3a3] hover:border-[#ff453a] hover:text-[#ff453a]"
          >
            Delete
          </button>
        </AdminForm>
      </div>
    </div>
  );
}
