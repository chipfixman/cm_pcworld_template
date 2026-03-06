import Link from 'next/link';
import { fetcher, type Article, type Paginated } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';

async function getLatest() {
  try {
    const data = await fetcher<Paginated<Article>>('/articles?limit=12');
    return data;
  } catch {
    return { items: [], total: 0, page: 1, limit: 12 };
  }
}

export default async function HomePage() {
  const { items } = await getLatest();

  return (
    <div className="container py-10">
      <section className="mb-12">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Latest stories
        </h1>
        <p className="text-muted">
          Tech news, reviews, and how-to guides
        </p>
      </section>

      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <div className="col-span-full rounded-xl border border-border bg-surface p-12 text-center text-muted shadow-card">
            <p>No articles yet. Add content from the admin dashboard.</p>
            <Link href="/admin" className="mt-4 inline-block font-medium text-accent hover:underline">
              Go to Admin →
            </Link>
          </div>
        ) : (
          items.map((article) => <ArticleCard key={article.id} article={article} />)
        )}
      </section>
    </div>
  );
}
