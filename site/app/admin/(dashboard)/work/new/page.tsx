import { redirect } from "next/navigation";

export default function AdminNewWorkPage() {
  redirect("/admin/work?new=1");
}
