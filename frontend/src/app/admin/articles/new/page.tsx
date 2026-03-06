'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authFetcher, fetcher, type Category } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [type, setType] = useState('news');
  const [published, setPublished] = useState(false);
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    fetcher<Category[]>('/categories').then(setCategories).catch(() => {});
  }, [router]);

  function slugify(s: string) {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          slug: slug || slugify(title),
          excerpt: excerpt || undefined,
          body,
          imageUrl: imageUrl || undefined,
          type,
          published,
          categoryId: categoryId || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.message || 'Failed to create');
        setLoading(false);
        return;
      }
      const data = await res.json();
      router.push(`/admin/articles/${data.id}`);
    } catch {
      setError('Network error');
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/articles" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)]">← Articles</Link>
        <h1 className="text-2xl font-bold text-white">New article</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        {error && <div className="rounded bg-red-500/20 px-3 py-2 text-sm text-red-400">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-white">Title *</label>
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (!slug) setSlug(slugify(e.target.value)); }}
            className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white"
            placeholder="auto from title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">Body *</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white"
            rows={10}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white"
          />
        </div>
        <div className="flex gap-6">
          <div>
            <label className="block text-sm font-medium text-white">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white"
            >
              <option value="news">News</option>
              <option value="review">Review</option>
              <option value="how-to">How-To</option>
              <option value="deal">Deal</option>
              <option value="best-pick">Best Pick</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
              className="mt-1 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white"
            >
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              <span className="text-sm text-white">Published</span>
            </label>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="btn btn-primary">Create article</button>
          <Link href="/admin/articles" className="btn btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
