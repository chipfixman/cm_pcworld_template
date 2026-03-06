import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link as I18nLink } from '@/i18n/navigation';
import { fetcher, type Article } from '@/lib/api';

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let article: Article | null = null;
  try {
    article = await fetcher<Article>(`/articles/slug/${encodeURIComponent(slug)}?incView=1`);
  } catch {
    notFound();
  }
  if (!article) notFound();

  const t = await getTranslations('common');
  const tArticle = await getTranslations('article');

  return (
    <article className="container py-8">
      <nav className="mb-6 text-sm text-muted">
        <I18nLink href="/" className="hover:text-accent">
          {t('home')}
        </I18nLink>
        {article.category && (
          <>
            <span className="mx-2">/</span>
            <I18nLink href={`/category/${article.category.slug}`} className="hover:text-accent">
              {article.category.name}
            </I18nLink>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-text">{article.title}</span>
      </nav>

      <header className="mb-8">
        {article.category && (
          <I18nLink
            href={`/category/${article.category.slug}`}
            className="text-sm font-semibold uppercase tracking-wider text-accent"
          >
            {article.category.name}
          </I18nLink>
        )}
        <h1 className="mt-2 text-3xl font-bold leading-tight text-white md:text-4xl">
          {article.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
          {article.author && (
            <span>
              {tArticle('by')} {article.author.name}
            </span>
          )}
          <span>
            {article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString(locale)
              : new Date(article.createdAt).toLocaleDateString(locale)}
          </span>
          {article.viewCount > 0 && (
            <span>
              {article.viewCount} {t('views')}
            </span>
          )}
        </div>
      </header>

      {article.imageUrl && (
        <div className="mb-8 aspect-video overflow-hidden rounded-xl bg-border">
          <img src={article.imageUrl} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      <div
        className="prose prose-invert max-w-none prose-p:leading-relaxed prose-p:text-text prose-a:text-accent prose-strong:text-white"
        dangerouslySetInnerHTML={{ __html: article.body.replace(/\n/g, '<br />') }}
      />
    </article>
  );
}
