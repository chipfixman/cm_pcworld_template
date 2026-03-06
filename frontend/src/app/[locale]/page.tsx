import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
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

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home');
  const { items } = await getLatest();

  return (
    <div className="container py-10">
      <section className="mb-12">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          {t('title')}
        </h1>
        <p className="text-muted">{t('subtitle')}</p>
      </section>

      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <div className="col-span-full rounded-xl border border-border bg-surface p-12 text-center text-muted shadow-card">
            <p>{t('noArticles')}</p>
            <Link href="/admin" className="mt-4 inline-block font-medium text-accent hover:underline">
              {t('goToAdmin')}
            </Link>
          </div>
        ) : (
          items.map((article, index) => <ArticleCard key={article.id} article={article} index={index} />)
        )}
      </section>
    </div>
  );
}
