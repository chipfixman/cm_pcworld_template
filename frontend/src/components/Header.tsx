'use client';

import Link from 'next/link';
import { useState } from 'react';

const mainNav = [
  { label: 'News', slug: 'news', children: ['All News', 'Laptops', 'Gaming', 'Windows', 'Security', 'Software'] },
  { label: 'Best Picks', slug: 'best-picks' },
  { label: 'Reviews', slug: 'reviews' },
  { label: 'How-To', slug: 'how-to' },
  { label: 'Deals', slug: 'deals' },
];

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-base/95 backdrop-blur-sm">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          PCWorld
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => (
            <div
              key={item.slug}
              className="relative"
              onMouseEnter={() => item.children && setOpenMenu(item.slug)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                href={`/category/${item.slug}`}
                className="block px-3 py-2 text-sm font-medium text-text hover:text-accent"
              >
                {item.label}
              </Link>
              {item.children && openMenu === item.slug && (
                <div className="absolute left-0 top-full min-w-[180px] rounded-lg border border-border bg-surface py-2 shadow-card">
                  {item.children.map((child) => (
                    <Link
                      key={child}
                      href={`/category/${item.slug}`}
                      className="block px-4 py-2 text-sm text-text hover:bg-surface-hover hover:text-accent"
                    >
                      {child}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-surface-hover hover:text-accent"
          >
            Admin
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-text hover:bg-surface-hover md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className="block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-surface p-4 md:hidden">
          {mainNav.map((item) => (
            <Link
              key={item.slug}
              href={`/category/${item.slug}`}
              className="block py-2.5 font-medium text-text hover:text-accent"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
