import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmit } from "@/components/admin/admin-submit";
import { CopyShareLink } from "@/components/admin/copy-share-link";
import {
  clearProposalSignatureAction,
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
import {
  formatSignedAt,
  proposalContentHash,
} from "@/lib/proposal-signature";
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
  const editedAfterSigning =
    proposal.signedAt && proposal.signedHash
      ? proposalContentHash(proposal) !== proposal.signedHash
      : false;

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
          Anyone with the link can view the proposal - no login required.
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

      <section className="mt-6 border border-white/10 p-6 text-sm">
        <h2 className="text-xs uppercase tracking-wider text-[#737373]">
          Signature
        </h2>
        {proposal.signedAt ? (
          <div className="mt-3 space-y-3">
            <div className="flex h-20 items-end border-b border-white/15 bg-white px-4 pb-2">
              {proposal.signatureImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={proposal.signatureImage}
                  alt={`Signature of ${proposal.signerName}`}
                  className="h-full w-auto object-contain object-left"
                />
              ) : (
                <p className="font-serif text-2xl italic text-black">
                  {proposal.signerName}
                </p>
              )}
            </div>
            <p className="text-white">
              {proposal.signerName} ·{" "}
              <span className="text-[#a3a3a3]">
                {formatSignedAt(proposal.signedAt)}
              </span>
            </p>
            <p className="text-xs text-[#737373]">
              IP {proposal.signerIp ?? "unknown"} ·{" "}
              {proposal.signerUserAgent ?? "unknown browser"}
            </p>
            {editedAfterSigning ? (
              <p className="border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-200">
                This proposal was edited after it was signed. The signature
                covers the earlier version. Clear the signature to have the
                client sign the current version.
              </p>
            ) : (
              <p className="text-xs text-emerald-400">
                Unchanged since signing.
              </p>
            )}
            <AdminForm
              action={clearProposalSignatureAction}
              successMessage="Signature cleared"
              alwaysEnableSubmit
            >
              <input type="hidden" name="id" value={proposal.id} />
              <button
                type="submit"
                className="border border-white/20 px-4 py-2 text-xs text-[#a3a3a3] hover:border-white/40 hover:text-white"
              >
                Clear signature and reopen
              </button>
            </AdminForm>
          </div>
        ) : (
          <p className="mt-2 text-[#a3a3a3]">
            Not signed yet. The client can sign from the proposal link.
          </p>
        )}
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
