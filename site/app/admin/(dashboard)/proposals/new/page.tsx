import Link from "next/link";
import { ProposalCreateForm } from "@/components/admin/proposal-create-form";

export default function AdminNewProposalPage() {
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
      <h1 className="text-2xl font-medium">New proposal</h1>
      <p className="mt-2 text-sm text-[#737373]">
        Flat quote with deliverables, timeframe, and terms. After create you get
        a unique link to send the client.
      </p>
      <ProposalCreateForm />
    </div>
  );
}
