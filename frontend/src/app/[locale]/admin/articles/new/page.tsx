'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { fetcher, type Category } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function NewArticlePage() {
  const router = useRouter();
  const t = useTranslations('admin');
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
        <Link href="/admin/articles" className="text-muted hover:text-accent">
          {t('backToArticles')}
        </Link>
        <h1 className="text-2xl font-bold text-white">{t('newArticle')}</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        {error && (
          <div className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-400">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium text-text">{t('title')} *</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slug) setSlug(slugify(e.target.value));
            }}
            className="input-field mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text">{t('slug')}</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text">{t('excerpt')}</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="input-field mt-1" rows={2} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text">{t('body')} *</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} className="input-field mt-1" rows={10} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-text">{t('imageUrl')}</label>
          <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input-field mt-1" />
        </div>
        <div className="flex gap-6">
          <div>
            <label className="block text-sm font-medium text-text">{t('type')}</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="input-field mt-1">
              <option value="news">{t('news')}</option>
              <option value="review">{t('review')}</option>
              <option value="how-to">{t('howTo')}</option>
              <option value="deal">{t('deal')}</option>
              <option value="best-pick">{t('bestPick')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text">{t('category')}</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
              className="input-field mt-1"
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
              <span className="text-sm text-text">{t('published')}</span>
            </label>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {t('createArticle')}
          </button>
          <Link href="/admin/articles" className="btn btn-ghost">
            {t('cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
}
