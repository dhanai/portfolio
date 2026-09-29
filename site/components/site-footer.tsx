"use client";

import { usePathname } from "next/navigation";
import type { SiteConfigView } from "@/lib/site-config";

export function SiteFooter({ config }: { config: SiteConfigView }) {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="site-footer mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={`mailto:${config.links.email}`}
          className="text-sm text-muted transition-colors hover:text-accent"
        >
          {config.links.email}
        </a>
        <div className="flex flex-col gap-2 text-sm text-muted sm:items-end">
          <div className="flex flex-wrap gap-5">
            <a
              href={config.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
            <a
              href={config.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            {config.links.instagram && (
              <a
                href={config.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                Instagram
              </a>
            )}
          </div>
          <p className="text-xs text-muted/60">© {year}</p>
        </div>
      </div>
    </footer>
  );
}
