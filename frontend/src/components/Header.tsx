'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';

const mainNavKeys = [
  { key: 'news', slug: 'news', children: ['allNews', 'laptops', 'gaming', 'windows', 'security', 'software'] },
  { key: 'bestPicks', slug: 'best-picks' },
  { key: 'reviews', slug: 'reviews' },
  { key: 'howTo', slug: 'how-to' },
  { key: 'deals', slug: 'deals' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-base/95 backdrop-blur-sm">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          PCWorld
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {mainNavKeys.map((item) => (
            <div
              key={item.slug}
              className="relative"
              onMouseEnter={() => 'children' in item && item.children && setOpenMenu(item.slug)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                href={`/category/${item.slug}`}
                className="block px-3 py-2 text-sm font-medium text-text hover:text-accent"
              >
                {t(item.key)}
              </Link>
              {'children' in item && item.children && openMenu === item.slug && (
                <div className="absolute left-0 top-full min-w-[180px] rounded-lg border border-border bg-surface py-2 shadow-card">
                  {(item as { children: readonly string[] }).children.map((child) => (
                    <Link
                      key={child}
                      href={`/category/${item.slug}`}
                      className="block px-4 py-2 text-sm text-text hover:bg-surface-hover hover:text-accent"
                    >
                      {t(child)}
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
            {tCommon('admin')}
          </Link>
          <div className="flex rounded-lg border border-border bg-surface-hover overflow-hidden">
            <Link
              href="/"
              locale="zh"
              className={`px-2.5 py-1 text-xs font-medium ${locale === 'zh' ? 'bg-accent text-white' : 'text-muted hover:text-text'}`}
            >
              中文
            </Link>
            <Link
              href="/"
              locale="en"
              className={`px-2.5 py-1 text-xs font-medium ${locale === 'en' ? 'bg-accent text-white' : 'text-muted hover:text-text'}`}
            >
              EN
            </Link>
          </div>
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
          {mainNavKeys.map((item) => (
            <Link
              key={item.slug}
              href={`/category/${item.slug}`}
              className="block py-2.5 font-medium text-text hover:text-accent"
              onClick={() => setMobileOpen(false)}
            >
              {t(item.key)}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
