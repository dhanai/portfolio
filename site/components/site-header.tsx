"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteConfigView } from "@/lib/site-config";

export function SiteHeader({ config }: { config: SiteConfigView }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="site-header sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-medium tracking-tight text-foreground"
        >
          <span className="h-2 w-2 rounded-full bg-accent transition-shadow group-hover:shadow-[0_0_12px_var(--accent)]" />
          {config.fullName}
        </Link>
        <nav className="flex items-center gap-8">
          {config.nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`label-caps transition-colors ${
                  active ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={`mailto:${config.links.email}`}
            className="hidden border border-border px-4 py-1.5 label-caps text-foreground transition-colors hover:border-accent hover:text-accent sm:inline-block"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
