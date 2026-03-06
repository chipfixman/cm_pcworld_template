const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

export async function authFetcher<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  imageUrl: string | null;
  type: string;
  published: boolean;
  viewCount: number;
  categoryId: number | null;
  category?: { id: number; name: string; slug: string } | null;
  author?: { id: number; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
