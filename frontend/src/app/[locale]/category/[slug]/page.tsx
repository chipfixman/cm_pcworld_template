import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { fetcher, type Article, type Category, type Paginated } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';

async function getCategory(slug: string) {
  try {
    const cat = await fetcher<Category>(`/categories/${slug}`);
    return cat;
  } catch {
    return null;
  }
}

async function getArticles(slug: string) {
  try {
    const data = await fetcher<Paginated<Article>>(
      `/articles?categorySlug=${encodeURIComponent(slug)}&limit=24`
    );
    return data;
  } catch {
    return { items: [], total: 0, page: 1, limit: 24 };
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [category, list] = await Promise.all([getCategory(slug), getArticles(slug)]);
  const title = category?.name ?? slug.replace(/-/g, ' ');
  const items = list.items;

  const t = await getTranslations('category');

  return (
    <div className="container py-10">
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white capitalize md:text-4xl">
          {title}
        </h1>
        {category?.description && <p className="mt-2 text-muted">{category.description}</p>}
      </section>

      {items.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center text-muted shadow-card">
          {t('noArticles')}
        </div>
      ) : (
        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </section>
      )}
    </div>
  );
}
