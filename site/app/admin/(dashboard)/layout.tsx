import Link from "next/link";
import { logoutAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/auth/require-admin";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/site", label: "Site & Hero" },
  { href: "/admin/work", label: "Work" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/resume", label: "Resume" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
      <header className="border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-sm font-medium">
              CMS <span className="text-[#ff453a]">·</span> Portfolio
            </Link>
            <nav className="hidden gap-5 sm:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs uppercase tracking-wider text-[#737373] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-[#737373] hover:text-white"
            >
              View site →
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-xs uppercase tracking-wider text-[#737373] hover:text-white"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
