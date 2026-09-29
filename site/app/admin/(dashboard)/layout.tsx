import { AdminShell } from "@/components/admin/admin-shell";
import { ConfirmProvider } from "@/components/admin/confirm-dialog";
import { logoutAction } from "@/lib/auth/actions";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <ConfirmProvider>
      <AdminShell logoutAction={logoutAction}>{children}</AdminShell>
    </ConfirmProvider>
  );
}
