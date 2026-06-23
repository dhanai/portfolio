import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [workCount, contentCount] = await Promise.all([
    prisma.work.count(),
    prisma.contentBlock.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-medium">Dashboard</h1>
      <p className="mt-2 text-sm text-[#737373]">
        Edit portfolio content. Changes publish immediately.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Stat label="Work items" value={workCount} href="/admin/work" />
        <Stat label="Content blocks" value={contentCount} href="/admin/site" />
        <Stat label="Public site" value="→" href="/" external />
      </div>

      <div className="mt-10 border border-white/10 p-6">
        <h2 className="text-sm font-medium">Quick links</h2>
        <ul className="mt-4 space-y-2 text-sm text-[#a3a3a3]">
          <li>
            <Link href="/admin/work/new" className="hover:text-[#ff453a]">
              + New work item
            </Link>
          </li>
          <li>
            <Link href="/admin/site" className="hover:text-white">
              Edit hero & site settings
            </Link>
          </li>
          <li>
            <Link href="/admin/resume" className="hover:text-white">
              Edit resume (JSON)
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: number | string;
  href: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className="block border border-white/10 p-5 transition-colors hover:border-white/20"
    >
      <p className="text-xs uppercase tracking-wider text-[#737373]">{label}</p>
      <p className="mt-2 text-3xl font-medium">{value}</p>
    </Link>
  );
}
