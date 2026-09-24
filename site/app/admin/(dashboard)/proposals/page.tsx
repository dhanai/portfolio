import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  formatMoney,
  formatProposalDate,
  proposalStatusClass,
} from "@/lib/proposals";

export const dynamic = "force-dynamic";

export default async function AdminProposalsPage() {
  const proposals = await prisma.proposal.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium">Proposals</h1>
          <p className="mt-2 text-sm text-[#737373]">
            Create proposals behind admin, then share the unique client link.
          </p>
        </div>
        <Link
          href="/admin/proposals/new"
          className="inline-flex items-center justify-center bg-white px-4 py-2 text-sm font-medium text-black hover:opacity-90"
        >
          + New proposal
        </Link>
      </div>

      <div className="mt-8 overflow-hidden border border-white/10">
        {proposals.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[#737373]">
            No proposals yet.{" "}
            <Link href="/admin/proposals/new" className="text-white underline">
              Create one
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-white/10">
            {proposals.map((prop) => (
              <li key={prop.id}>
                <Link
                  href={`/admin/proposals/${prop.id}`}
                  className="flex flex-col gap-2 px-4 py-4 transition-colors hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">
                      {prop.clientCompany || prop.clientName}{" "}
                      <span className="text-[#525252]">·</span>{" "}
                      <span className="font-mono text-[#a3a3a3]">
                        {prop.number}
                      </span>
                    </p>
                    <p className="mt-1 truncate text-xs text-[#737373]">
                      {prop.title} · {formatProposalDate(prop.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 sm:shrink-0">
                    <span
                      className={`text-[10px] uppercase tracking-wider ${proposalStatusClass(prop.status)}`}
                    >
                      {prop.status}
                    </span>
                    <span className="font-mono text-sm text-white">
                      {formatMoney(prop.amount)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
