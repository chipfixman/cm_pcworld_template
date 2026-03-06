'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const t = useTranslations('admin');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.replace('/admin/login');
  }, [router]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">{t('dashboard')}</h1>
      <p className="mt-2 text-muted">{t('dashboardSubtitle')}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/articles"
          className="rounded-xl border border-border bg-surface p-6 shadow-card transition hover:border-accent/50 hover:shadow-glow"
        >
          <h2 className="text-lg font-semibold text-white">{t('articles')}</h2>
          <p className="mt-1 text-sm text-muted">{t('articlesSubtitle')}</p>
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-xl border border-border bg-surface p-6 shadow-card transition hover:border-accent/50 hover:shadow-glow"
        >
          <h2 className="text-lg font-semibold text-white">{t('categories')}</h2>
          <p className="mt-1 text-sm text-muted">{t('categoriesSubtitle')}</p>
        </Link>
      </div>
    </div>
  );
}
