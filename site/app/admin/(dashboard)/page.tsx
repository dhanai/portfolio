import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteContent } from "@/lib/content";

export default async function AdminDashboardPage() {
  const [workCount, publishedCount, site] = await Promise.all([
    prisma.work.count(),
    prisma.work.count({ where: { published: true } }),
    getSiteContent(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-medium">Dashboard</h1>
      <p className="mt-2 text-sm text-[#737373]">
        One-pager CMS — edits publish immediately on dhanai.net.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Stat label="Work (published)" value={`${publishedCount}/${workCount}`} href="/admin/work" />
        <Stat
          label="Homepage shows"
          value={site.homepageWorkCount}
          href="/admin/site"
        />
        <Stat label="Public site" value="→" href="/" external />
      </div>

      <div className="mt-10 border border-white/10 p-6">
        <h2 className="text-sm font-medium">One-pager sections</h2>
        <ul className="mt-4 space-y-2 text-sm text-[#a3a3a3]">
          <li>
            <Link href="/admin/site" className="hover:text-white">
              Hero &amp; homepage work count
            </Link>
          </li>
          <li>
            <Link href="/admin/work" className="hover:text-white">
              Selected work (cards + sort)
            </Link>
          </li>
          <li>
            <Link href="/admin/creative" className="hover:text-white">
              Creative showcase rail
            </Link>
          </li>
          <li>
            <Link href="/admin/about" className="hover:text-white">
              About + resume CTA copy
            </Link>
          </li>
          <li>
            <Link href="/admin/resume" className="hover:text-white">
              Resume (web JSON + PDF path)
            </Link>
          </li>
          <li>
            <Link href="/admin/work/new" className="hover:text-[#ff453a]">
              + New work item
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
