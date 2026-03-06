'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authFetcher, type Article, type Paginated } from '@/lib/api';

export default function AdminArticlesPage() {
  const router = useRouter();
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

  if (loading) return <div className="text-[var(--color-text-muted)]">Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Articles</h1>
        <Link href="/admin/articles/new" className="btn btn-primary">New article</Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-lg border border-[var(--color-border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-surface)]">
            <tr>
              <th className="px-4 py-3 font-medium text-white">Title</th>
              <th className="px-4 py-3 font-medium text-white">Category</th>
              <th className="px-4 py-3 font-medium text-white">Type</th>
              <th className="px-4 py-3 font-medium text-white">Status</th>
              <th className="px-4 py-3 font-medium text-white">Updated</th>
              <th className="px-4 py-3 font-medium text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {items.map((a) => (
              <tr key={a.id} className="hover:bg-[var(--color-surface)]/50">
                <td className="px-4 py-3 font-medium text-white">{a.title}</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{a.category?.name ?? '—'}</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{a.type}</td>
                <td className="px-4 py-3">
                  <span className={a.published ? 'text-green-400' : 'text-amber-400'}>
                    {a.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">
                  {new Date(a.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/articles/${a.id}`} className="text-[var(--color-accent)] hover:underline">Edit</Link>
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
            Previous
          </button>
          <span className="flex items-center px-4 text-[var(--color-text-muted)]">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
