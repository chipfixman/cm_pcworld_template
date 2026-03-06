import Link from 'next/link';
import type { Article } from '@/lib/api';

export function ArticleCard({ article }: { article: Article }) {
  const href = `/article/${article.slug}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] transition hover:border-[var(--color-accent)]/50">
      <Link href={href} className="block aspect-video overflow-hidden bg-[var(--color-border)]">
        {article.imageUrl ? (
          <img src={article.imageUrl} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-[var(--color-text-muted)]">📰</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {article.category && (
          <Link
            href={`/category/${article.category.slug}`}
            className="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--color-accent)]"
          >
            {article.category.name}
          </Link>
        )}
        <Link href={href} className="mb-2 text-lg font-semibold leading-tight text-white transition group-hover:text-[var(--color-accent)]">
          {article.title}
        </Link>
        {article.excerpt && (
          <p className="mt-auto line-clamp-2 text-sm text-[var(--color-text-muted)]">{article.excerpt}</p>
        )}
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : new Date(article.createdAt).toLocaleDateString()}
        </p>
      </div>
    </article>
  );
}
