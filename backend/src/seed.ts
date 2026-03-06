import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './modules/users/user.entity';
import { Category } from './modules/categories/category.entity';
import { Article, ArticleType } from './modules/articles/article.entity';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'xzpp123456',
  database: process.env.MYSQL_DB || 'pcworld',
  entities: [User, Category, Article],
  synchronize: false,
});

const MOCK_ARTICLES = [
  {
    title: 'Best laptops for 2025: Top picks for work and play',
    slug: 'best-laptops-2025',
    excerpt: 'We tested dozens of laptops to bring you the best options for productivity, gaming, and everyday use.',
    body: 'Whether you need a powerhouse for video editing or a lightweight machine for commuting, our roundup has you covered. From premium ultrabooks to budget-friendly Chromebooks, here are the best laptops you can buy right now.\n\nOur top pick for most people remains the MacBook Air M3 for its balance of performance and battery life. Windows users should consider the Dell XPS 15 for creative work or the ThinkPad X1 Carbon for business.',
    type: ArticleType.BEST_PICK,
    categorySlug: 'laptops',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
  },
  {
    title: 'Windows 12: What we know so far',
    slug: 'windows-12-preview',
    excerpt: 'Microsoft\'s next major Windows release is on the horizon. Here\'s everything we know about features and release timing.',
    body: 'Windows 12 is expected to bring a refreshed interface, improved AI integration, and better performance on hybrid chips. Leaks suggest a 2025 release window with a focus on Copilot and modern hardware support.\n\nWe\'ll update this article as more official details emerge from Microsoft.',
    type: ArticleType.NEWS,
    categorySlug: 'windows',
    imageUrl: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800',
  },
  {
    title: 'How to speed up your PC in 5 minutes',
    slug: 'how-to-speed-up-pc',
    excerpt: 'Quick tweaks that actually make a difference—no reinstalling Windows required.',
    body: 'Start by disabling startup apps you don\'t need: open Task Manager, go to Startup, and disable anything that isn\'t essential. Next, run Disk Cleanup and clear temporary files. Finally, check for Windows updates and driver updates—outdated drivers can cause slowdowns.\n\nIf you have an SSD, ensure TRIM is enabled. For older PCs, adding more RAM often gives the biggest boost.',
    type: ArticleType.HOW_TO,
    categorySlug: 'news',
    imageUrl: null,
  },
  {
    title: 'RTX 5090 review: Nvidia\'s new flagship tested',
    slug: 'rtx-5090-review',
    excerpt: 'We put Nvidia\'s latest flagship GPU through its paces in games and creative workloads.',
    body: 'The RTX 5090 delivers a substantial leap in ray tracing and raw performance over the 4090. In our tests, we saw 40–50% gains at 4K in demanding titles. Power draw remains high, so a quality PSU and cooling are a must.\n\nContent creators will appreciate the improved NVENC and AI features. For gamers, this is the card to get if budget isn\'t a concern.',
    type: ArticleType.REVIEW,
    categorySlug: 'gaming',
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800',
  },
  {
    title: 'Prime Day laptop deals: Save up to $400',
    slug: 'prime-day-laptop-deals',
    excerpt: 'The best laptop deals we\'ve found during Prime Day—updated throughout the sale.',
    body: 'Amazon Prime Day brings some of the best laptop discounts of the year. We\'re tracking deals on everything from entry-level machines to high-end workstations.\n\nKey models to watch: the M2 MacBook Air, various Dell XPS and Inspiron models, and Lenovo ThinkPad series. Deals often sell out, so act fast if you see a price you like.',
    type: ArticleType.DEAL,
    categorySlug: 'deals',
    imageUrl: 'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=800',
  },
  {
    title: 'Best password managers in 2025',
    slug: 'best-password-managers-2025',
    excerpt: 'Keep your accounts secure with one of these top-rated password managers.',
    body: 'We compared LastPass, 1Password, Bitwarden, and others on security, ease of use, and value. Our recommendation: 1Password for families and power users, Bitwarden for the best free option.\n\nAll of our picks support 2FA, secure sharing, and cross-platform sync. Avoid reusing passwords—a good manager makes it easy to stay unique everywhere.',
    type: ArticleType.BEST_PICK,
    categorySlug: 'security',
    imageUrl: null,
  },
];

async function seed() {
  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);
  const categoryRepo = dataSource.getRepository(Category);
  const articleRepo = dataSource.getRepository(Article);

  let adminUser = await userRepo.findOne({ where: { email: 'admin@pcworld.com' } });
  if (!adminUser) {
    const hash = await bcrypt.hash('admin123', 10);
    adminUser = await userRepo.save(
      userRepo.create({
        email: 'admin@pcworld.com',
        passwordHash: hash,
        name: 'Admin',
        role: UserRole.ADMIN,
      }),
    );
    console.log('Created admin user: admin@pcworld.com / admin123');
  }

  const defaultCategories = [
    { name: 'News', slug: 'news', sortOrder: 1 },
    { name: 'Best Picks', slug: 'best-picks', sortOrder: 2 },
    { name: 'Reviews', slug: 'reviews', sortOrder: 3 },
    { name: 'How-To', slug: 'how-to', sortOrder: 4 },
    { name: 'Deals', slug: 'deals', sortOrder: 5 },
    { name: 'Laptops', slug: 'laptops', sortOrder: 6 },
    { name: 'Gaming', slug: 'gaming', sortOrder: 7 },
    { name: 'Windows', slug: 'windows', sortOrder: 8 },
    { name: 'Security', slug: 'security', sortOrder: 9 },
  ];

  for (const c of defaultCategories) {
    const found = await categoryRepo.findOne({ where: { slug: c.slug } });
    if (!found) {
      await categoryRepo.save(categoryRepo.create(c));
      console.log('Created category:', c.slug);
    }
  }

  // Mock articles: only add if no articles exist
  const articleCount = await articleRepo.count();
  if (articleCount === 0) {
    const categories = await categoryRepo.find();
    const slugToId = Object.fromEntries(categories.map((cat) => [cat.slug, cat.id]));
    const now = new Date();

    for (const m of MOCK_ARTICLES) {
      const categoryId = slugToId[m.categorySlug] ?? null;
      const article = articleRepo.create({
        title: m.title,
        slug: m.slug,
        excerpt: m.excerpt,
        body: m.body,
        imageUrl: m.imageUrl,
        type: m.type,
        published: true,
        publishedAt: now,
        categoryId,
        authorId: adminUser!.id,
      });
      await articleRepo.save(article);
      console.log('Created mock article:', m.slug);
    }
    console.log(`Created ${MOCK_ARTICLES.length} mock articles.`);
  }

  await dataSource.destroy();
  console.log('Seed done.');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
