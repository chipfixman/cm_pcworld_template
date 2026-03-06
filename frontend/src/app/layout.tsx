import './globals.css';

export const metadata = {
  title: 'PCWorld – Tech News, Reviews & How-To',
  description: 'Tech news, best picks, reviews, and how-to guides for PCs, laptops, gaming, and software.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
