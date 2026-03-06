import Link from 'next/link';
import type { Article } from '@/lib/api';

export function ArticleCard({ article }: { article: Article }) {
  const href = `/article/${article.slug}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition hover:border-accent/50 hover:shadow-glow">
      <Link href={href} className="block aspect-video overflow-hidden bg-border">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-muted">📰</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {article.category && (
          <Link
            href={`/category/${article.category.slug}`}
            className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent"
          >
            {article.category.name}
          </Link>
        )}
        <Link
          href={href}
          className="mb-2 text-lg font-semibold leading-tight text-white transition group-hover:text-accent"
        >
          {article.title}
        </Link>
        {article.excerpt && (
          <p className="mt-auto line-clamp-2 text-sm text-muted">{article.excerpt}</p>
        )}
        <p className="mt-2 text-xs text-muted">
          {article.publishedAt
            ? new Date(article.publishedAt).toLocaleDateString()
            : new Date(article.createdAt).toLocaleDateString()}
        </p>
      </div>
    </article>
  );
}
