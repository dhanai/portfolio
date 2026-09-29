import { redirect } from "next/navigation";

export default function AdminNewInvoicePage() {
  redirect("/admin/invoices?new=1");
}
