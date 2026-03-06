'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { authFetcher, type Article, type Paginated } from '@/lib/api';

export default function AdminArticlesPage() {
  const router = useRouter();
  const t = useTranslations('admin');
  const [items, setItems] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    authFetcher<Paginated<Article>>(`/articles/admin/list?page=${page}&limit=20`, token)
      .then((data) => {
        setItems(data.items);
        setTotal(data.total);
      })
      .catch(() => setError('Failed to load articles'))
      .finally(() => setLoading(false));
  }, [page, router]);

  if (loading) return <div className="text-muted">Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t('articles')}</h1>
        <Link href="/admin/articles/new" className="btn btn-primary">
          {t('newArticle')}
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-border shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 font-medium text-white">{t('title')}</th>
              <th className="px-4 py-3 font-medium text-white">{t('category')}</th>
              <th className="px-4 py-3 font-medium text-white">{t('type')}</th>
              <th className="px-4 py-3 font-medium text-white">{t('publishedStatus')}</th>
              <th className="px-4 py-3 font-medium text-white">{t('updated')}</th>
              <th className="px-4 py-3 font-medium text-white">{t('edit')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((a) => (
              <tr key={a.id} className="hover:bg-surface-hover">
                <td className="px-4 py-3 font-medium text-white">{a.title}</td>
                <td className="px-4 py-3 text-muted">{a.category?.name ?? '—'}</td>
                <td className="px-4 py-3 text-muted">{a.type}</td>
                <td className="px-4 py-3">
                  <span className={a.published ? 'text-green-400' : 'text-amber-400'}>
                    {a.published ? t('publishedStatus') : t('draft')}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Date(a.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/articles/${a.id}`} className="text-accent hover:underline">
                    {t('edit')}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > 20 && (
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="btn btn-ghost"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            {t('previous')}
          </button>
          <span className="flex items-center px-4 text-muted">
            {t('page', { page, total: totalPages })}
          </span>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {t('next')}
          </button>
        </div>
      )}
    </div>
  );
}
