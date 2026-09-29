import { redirect } from "next/navigation";

export default function AdminNewProposalPage() {
  redirect("/admin/proposals?new=1");
}
