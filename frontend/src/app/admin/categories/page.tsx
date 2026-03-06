'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authFetcher, fetcher, type Category } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<number | null>(null);
  const [addName, setAddName] = useState('');
  const [addSlug, setAddSlug] = useState('');
  const [addDesc, setAddDesc] = useState('');
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDesc, setFormDesc] = useState('');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    fetcher<Category[]>('/categories')
      .then(setCategories)
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: addName, slug: addSlug || addName.toLowerCase().replace(/\s+/g, '-'), description: addDesc || undefined }),
      });
      if (!res.ok) throw new Error('Failed');
      const cat = await res.json();
      setCategories((prev) => [...prev, cat]);
      setAddName('');
      setAddSlug('');
      setAddDesc('');
    } catch {
      setError('Create failed');
    }
  }

  function startEdit(c: Category) {
    setEditing(c.id);
    setFormName(c.name);
    setFormSlug(c.slug);
    setFormDesc(c.description || '');
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (editing == null) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API}/categories/${editing}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: formName, slug: formSlug, description: formDesc || undefined }),
      });
      if (!res.ok) throw new Error('Failed');
      const updated = await res.json();
      setCategories((prev) => prev.map((c) => (c.id === editing ? updated : c)));
      setEditing(null);
    } catch {
      setError('Update failed');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this category?')) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch(`${API}/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError('Delete failed');
    }
  }

  if (loading) return <div className="text-muted">Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Categories</h1>
      <div className="mt-6 max-w-md">
        <h2 className="text-lg font-medium text-white">Add category</h2>
        <form onSubmit={handleCreate} className="mt-2 flex flex-wrap gap-4">
          <input
            value={addName}
            onChange={(e) => { setAddName(e.target.value); setAddSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }}
            placeholder="Name"
            className="input-field"
            required
          />
          <input
            value={addSlug}
            onChange={(e) => setAddSlug(e.target.value)}
            placeholder="Slug"
            className="input-field"
          />
          <input
            value={addDesc}
            onChange={(e) => setAddDesc(e.target.value)}
            placeholder="Description"
            className="input-field min-w-[200px] flex-1"
          />
          <button type="submit" className="btn btn-primary">Add</button>
        </form>
      </div>
      <div className="mt-8 overflow-x-auto rounded-xl border border-border shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 font-medium text-white">Name</th>
              <th className="px-4 py-3 font-medium text-white">Slug</th>
              <th className="px-4 py-3 font-medium text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-surface-hover">
                <td className="px-4 py-3 text-white">{c.name}</td>
                <td className="px-4 py-3 text-muted">{c.slug}</td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => startEdit(c)} className="mr-4 text-accent hover:underline">Edit</button>
                  <button type="button" onClick={() => handleDelete(c.id)} className="text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-card">
            <h2 className="text-lg font-semibold text-white">Edit category</h2>
            <form onSubmit={handleUpdate} className="mt-4 space-y-4">
              <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Name" className="input-field w-full" required />
              <input value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="Slug" className="input-field w-full" required />
              <input value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Description" className="input-field w-full" />
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" onClick={() => setEditing(null)} className="btn btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
