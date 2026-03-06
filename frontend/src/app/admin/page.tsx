'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.replace('/admin/login');
  }, [router]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Manage your content from the sidebar.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/articles"
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-accent)]/50"
        >
          <h2 className="text-lg font-semibold text-white">Articles</h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Create and edit articles</p>
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-accent)]/50"
        >
          <h2 className="text-lg font-semibold text-white">Categories</h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Manage categories</p>
        </Link>
      </div>
    </div>
  );
}
