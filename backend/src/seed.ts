import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './modules/users/user.entity';
import { Category } from './modules/categories/category.entity';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'xzpp123456',
  database: process.env.MYSQL_DB || 'pcworld',
  entities: [User, Category],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);
  const categoryRepo = dataSource.getRepository(Category);

  const existing = await userRepo.findOne({ where: { email: 'admin@pcworld.com' } });
  if (!existing) {
    const hash = await bcrypt.hash('admin123', 10);
    await userRepo.save(
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

  await dataSource.destroy();
  console.log('Seed done.');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
