import Link from 'next/link';

const links = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Admin', href: '/admin' },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="container py-10">
        <div className="flex flex-wrap justify-between gap-6">
          <div>
            <Link href="/" className="text-lg font-bold text-white">
              PCWorld
            </Link>
            <p className="mt-2 max-w-sm text-sm text-[var(--color-text-muted)]">
              Tech news, best picks, reviews, and how-to guides for PCs, laptops, gaming, and software.
            </p>
          </div>
          <div className="flex gap-8">
            {links.map(({ label, href }) => (
              <Link key={label} href={href} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)]">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-8 border-t border-[var(--color-border)] pt-6 text-center text-sm text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} PCWorld Template. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
