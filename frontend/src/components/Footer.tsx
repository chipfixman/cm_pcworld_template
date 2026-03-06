'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const linkKeys = ['privacy', 'terms', 'contact'] as const;

export function Footer() {
  const t = useTranslations('footer');
  const tCommon = useTranslations('common');

  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="container py-10">
        <div className="flex flex-wrap justify-between gap-6">
          <div>
            <Link href="/" className="text-lg font-bold text-white">
              PCWorld
            </Link>
            <p className="mt-2 max-w-sm text-sm text-muted">{t('description')}</p>
          </div>
          <div className="flex gap-8">
            {linkKeys.map((key) => (
              <Link key={key} href="#" className="text-sm text-muted hover:text-accent">
                {t(key)}
              </Link>
            ))}
            <Link href="/admin" className="text-sm text-muted hover:text-accent">
              {tCommon('admin')}
            </Link>
          </div>
        </div>
        <p className="mt-8 border-t border-border pt-6 text-center text-sm text-muted">
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
