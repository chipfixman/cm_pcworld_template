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
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const localeLabel = locale === 'zh' ? '中文' : 'English';
  const localeOptions = [
    { locale: 'zh' as const, label: '中文' },
    { locale: 'en' as const, label: 'English' },
  ];

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
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen((v) => !v)}
              onBlur={() => setTimeout(() => setLangDropdownOpen(false), 150)}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-hover px-3 py-1.5 text-sm text-text hover:bg-surface hover:text-accent"
              aria-expanded={langDropdownOpen}
              aria-haspopup="true"
              aria-label="Language"
            >
              <span>{localeLabel}</span>
              <svg className={`h-4 w-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 min-w-[120px] rounded-lg border border-border bg-surface py-1 shadow-card">
                {localeOptions.map((opt) => (
                  <Link
                    key={opt.locale}
                    href="/"
                    locale={opt.locale}
                    className={`block px-4 py-2 text-sm ${locale === opt.locale ? 'bg-accent/15 font-medium text-accent' : 'text-text hover:bg-surface-hover hover:text-accent'}`}
                    onClick={() => setLangDropdownOpen(false)}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            )}
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
