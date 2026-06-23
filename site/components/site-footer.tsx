import type { SiteConfigView } from "@/lib/site-config";

export function SiteFooter({ config }: { config: SiteConfigView }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">{config.fullName}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Design engineer · Los Angeles
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted sm:items-end">
          <a
            href={`mailto:${config.links.email}`}
            className="transition-colors hover:text-accent"
          >
            {config.links.email}
          </a>
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
