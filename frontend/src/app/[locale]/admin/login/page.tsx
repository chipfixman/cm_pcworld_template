'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminLoginPage() {
  const router = useRouter();
  const t = useTranslations('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }
      if (data.user?.role !== 'admin' && data.user?.role !== 'editor') {
        setError('Access denied. Admin or Editor role required.');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Network error');
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-card">
        <h1 className="text-2xl font-bold text-white">{t('login')}</h1>
        <p className="mt-1 text-sm text-muted">{t('loginSubtitle')}</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-400">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-text">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field mt-1"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? t('signingIn') : t('signIn')}
          </button>
        </form>
      </div>
    </div>
  );
}
