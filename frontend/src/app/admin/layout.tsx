'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  if (isLogin) {
    return <div className="min-h-screen bg-base">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-base">
      <aside className="fixed left-0 top-0 z-40 h-full w-56 border-r border-border bg-surface">
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/admin" className="font-bold text-white">PCWorld Admin</Link>
        </div>
        <nav className="space-y-1 p-4">
          <Link
            href="/admin"
            className="block rounded-lg px-3 py-2 text-sm text-text hover:bg-surface-hover hover:text-accent"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/articles"
            className="block rounded-lg px-3 py-2 text-sm text-text hover:bg-surface-hover hover:text-accent"
          >
            Articles
          </Link>
          <Link
            href="/admin/categories"
            className="block rounded-lg px-3 py-2 text-sm text-text hover:bg-surface-hover hover:text-accent"
          >
            Categories
          </Link>
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-hover hover:text-accent"
          >
            ← View site
          </Link>
        </nav>
      </aside>
      <div className="pl-56">
        <div className="container py-8">{children}</div>
      </div>
    </div>
  );
}
