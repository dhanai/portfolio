"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const primaryNav = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/site", label: "Site" },
  { href: "/admin/work", label: "Work" },
  { href: "/admin/creative", label: "Creative" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/resume", label: "Resume" },
];

const secondaryNav = [
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/proposals", label: "Proposals" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ pathname }: { pathname: string }) {
  return (
    <nav className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-0.5">
        {primaryNav.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            active={isActive(pathname, item.href, item.exact)}
          />
        ))}
      </div>
      <div className="my-4 border-t border-white/10" />
      <div className="space-y-0.5">
        {secondaryNav.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            active={isActive(pathname, item.href)}
          />
        ))}
      </div>
    </nav>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block border-l-2 px-4 py-2 text-sm transition-colors ${
        active
          ? "border-[#ff453a] bg-white/5 text-white"
          : "border-transparent text-[#8a8a8a] hover:bg-white/5 hover:text-white"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

function Rail({
  pathname,
  logoutAction,
}: {
  pathname: string;
  logoutAction: () => Promise<void>;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-6 pt-6">
        <Link href="/admin" className="text-sm font-medium">
          CMS <span className="text-[#ff453a]">·</span> Portfolio
        </Link>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto pb-4">
        <NavLinks pathname={pathname} />
      </div>
      <div className="space-y-1 border-t border-white/10 px-2 py-3 pb-6">
        <Link
          href="/"
          target="_blank"
          className="block px-3 py-2 text-xs text-[#8a8a8a] hover:text-white"
        >
          View site →
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full px-3 py-2 text-left text-xs text-[#8a8a8a] hover:text-white"
          >
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminShell({
  children,
  logoutAction,
}: {
  children: React.ReactNode;
  logoutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!navOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setNavOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [navOpen]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          className="flex h-11 w-11 items-center justify-center text-white"
          aria-label="Open menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
              d="M2 4.5h14M2 9h14M2 13.5h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <Link href="/admin" className="text-sm font-medium">
          CMS
        </Link>
        <span className="h-11 w-11" />
      </header>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-white/10 bg-[#080808] lg:block">
        <Rail pathname={pathname} logoutAction={logoutAction} />
      </aside>

      {navOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <aside className="absolute inset-0 flex min-h-0 flex-col bg-[#080808]">
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
              <p className="text-sm font-medium">Menu</p>
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                className="flex h-11 w-11 items-center justify-center text-[#a3a3a3] hover:text-white"
                aria-label="Close menu"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
              <Rail pathname={pathname} logoutAction={logoutAction} />
            </div>
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-60">
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
