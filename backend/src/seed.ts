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
  // Best Picks (10)
  { title: 'Best wireless earbuds 2025', slug: 'best-wireless-earbuds-2025', excerpt: 'Top true wireless earbuds for sound, fit, and battery life.', body: 'We tested the latest from Sony, Apple, Samsung, and more. The Sony WF-1000XM5 lead for noise cancellation; AirPods Pro 2 remain the best for Apple users.', type: ArticleType.BEST_PICK, categorySlug: 'best-picks', imageUrl: 'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=800' },
  { title: 'Best mechanical keyboards for typing and gaming', slug: 'best-mechanical-keyboards-2025', excerpt: 'Our favorite mechanical keyboards across price ranges.', body: 'From budget TKL boards to premium full-size options, these keyboards deliver the best typing and gaming experience. Key factors: switch type, build quality, and software.', type: ArticleType.BEST_PICK, categorySlug: 'best-picks', imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800' },
  { title: 'Best monitors for work and play', slug: 'best-monitors-2025', excerpt: '4K, ultrawide, and high-refresh picks for every desk.', body: 'Whether you need color accuracy for design or high refresh rates for gaming, we have a monitor recommendation. LG and Dell dominate our list this year.', type: ArticleType.BEST_PICK, categorySlug: 'best-picks', imageUrl: null },
  { title: 'Best SSDs for your PC or laptop', slug: 'best-ssds-2025', excerpt: 'NVMe and SATA SSDs that offer the best value and performance.', body: 'Storage prices have dropped. We recommend 1TB as a minimum for most users. Top picks include Samsung 990 Pro, WD Black SN850X, and Crucial P5 Plus.', type: ArticleType.BEST_PICK, categorySlug: 'best-picks', imageUrl: null },
  { title: 'Best webcams for streaming and video calls', slug: 'best-webcams-2025', excerpt: 'Upgrade your video quality with these top webcams.', body: 'Built-in laptop cams are rarely good enough for professional calls. The Logitech C920 and Razer Kiyo Pro lead our list for clarity and low-light performance.', type: ArticleType.BEST_PICK, categorySlug: 'best-picks', imageUrl: null },
  { title: 'Best VPN services in 2025', slug: 'best-vpn-2025', excerpt: 'Fast, private, and reliable VPNs we recommend.', body: 'We evaluate VPNs on speed, privacy policy, server coverage, and ease of use. NordVPN, ExpressVPN, and Mullvad are among our top picks for different needs.', type: ArticleType.BEST_PICK, categorySlug: 'best-picks', imageUrl: null },
  { title: 'Best external hard drives for backup', slug: 'best-external-hard-drives-2025', excerpt: 'Reliable external storage for backups and portability.', body: 'WD My Passport, Seagate Backup Plus, and Samsung T7 SSDs offer the best balance of capacity, speed, and durability for backing up your data.', type: ArticleType.BEST_PICK, categorySlug: 'best-picks', imageUrl: null },
  { title: 'Best gaming headsets under $150', slug: 'best-gaming-headsets-budget-2025', excerpt: 'Great sound and mic quality without breaking the bank.', body: 'The SteelSeries Arctis Nova and HyperX Cloud III deliver excellent value. We also include a few wireless options for those who want to cut the cord.', type: ArticleType.BEST_PICK, categorySlug: 'best-picks', imageUrl: null },
  { title: 'Best USB-C hubs and docking stations', slug: 'best-usb-c-hubs-2025', excerpt: 'Expand your laptop with the right hub or dock.', body: 'Modern laptops often have only USB-C. A good hub adds HDMI, USB-A, SD card readers, and charging. CalDigit and Anker lead our recommendations.', type: ArticleType.BEST_PICK, categorySlug: 'best-picks', imageUrl: null },
  { title: 'Best antivirus software for Windows', slug: 'best-antivirus-windows-2025', excerpt: 'Protect your PC with these top-rated security suites.', body: 'We test real-world malware blocking and impact on performance. Norton, Bitdefender, and Kaspersky consistently score well; Windows Defender is solid for free protection.', type: ArticleType.BEST_PICK, categorySlug: 'best-picks', imageUrl: null },
  // Reviews (10)
  { title: 'Dell XPS 16 review: Power and portability', slug: 'dell-xps-16-review-2025', excerpt: 'Dell\'s flagship 16-inch laptop gets the latest Intel and NVIDIA hardware.', body: 'The XPS 16 packs a 16-inch OLED display and up to an RTX 4070. Build quality is excellent, but battery life under load could be better. A strong choice for creators.', type: ArticleType.REVIEW, categorySlug: 'reviews', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800' },
  { title: 'Samsung Odyssey OLED G8 monitor review', slug: 'samsung-odyssey-g8-oled-review', excerpt: 'A stunning 34-inch ultrawide OLED for work and gaming.', body: 'Samsung\'s curved OLED delivers deep blacks and vibrant colors. 175Hz refresh and low input lag make it great for games. The only downside is the premium price.', type: ArticleType.REVIEW, categorySlug: 'reviews', imageUrl: null },
  { title: 'Logitech MX Master 3S review', slug: 'logitech-mx-master-3s-review', excerpt: 'The best productivity mouse gets a quiet upgrade.', body: 'The 3S keeps the excellent ergonomics and scroll wheel of the Master 3 while adding quieter clicks. Battery life is still weeks on a charge. A no-brainer for desk workers.', type: ArticleType.REVIEW, categorySlug: 'reviews', imageUrl: null },
  { title: 'AMD Ryzen 9 9950X review', slug: 'amd-ryzen-9-9950x-review', excerpt: 'AMD\'s 16-core flagship for content creation and heavy multitasking.', body: 'The 9950X leads in multi-threaded workloads and is more power-efficient than the previous generation. Gaming performance is strong, though Intel still leads in some titles.', type: ArticleType.REVIEW, categorySlug: 'reviews', imageUrl: null },
  { title: 'Apple M4 MacBook Pro 14 review', slug: 'apple-m4-macbook-pro-14-review', excerpt: 'The best MacBook gets even better with M4.', body: 'Faster CPU and GPU, same great battery life and display. The 14-inch M4 Pro is the sweet spot for most professionals. Only upgrade from M3 if you need the extra performance.', type: ArticleType.REVIEW, categorySlug: 'reviews', imageUrl: null },
  { title: 'SteelSeries Rival 5 gaming mouse review', slug: 'steelseries-rival-5-review', excerpt: 'A versatile gaming mouse with plenty of buttons.', body: 'The Rival 5 offers a comfortable shape, reliable sensor, and programmable side buttons. It\'s a solid mid-range option for MMO and productivity gamers alike.', type: ArticleType.REVIEW, categorySlug: 'reviews', imageUrl: null },
  { title: 'Sony WH-1000XM6 review', slug: 'sony-wh-1000xm6-review', excerpt: 'Sony\'s flagship headphones get smarter ANC.', body: 'The XM6 improve on an already excellent formula with better noise cancellation and call quality. Battery life remains 30 hours. Still the king of travel headphones.', type: ArticleType.REVIEW, categorySlug: 'reviews', imageUrl: null },
  { title: 'LG C4 OLED TV review', slug: 'lg-c4-oled-tv-review', excerpt: 'The best value OLED TV for 2025.', body: 'LG\'s C4 delivers stunning picture quality with four HDMI 2.1 ports and 120Hz support. Gaming features are top-notch. Slightly brighter than the C3, making it better for bright rooms.', type: ArticleType.REVIEW, categorySlug: 'reviews', imageUrl: null },
  { title: 'Razer BlackWidow V4 Pro review', slug: 'razer-blackwidow-v4-pro-review', excerpt: 'A premium mechanical keyboard with every bell and whistle.', body: 'Razer\'s flagship keyboard features hot-swap switches, a dial, and per-key RGB. Build quality is excellent. It\'s expensive but delivers for enthusiasts who want it all.', type: ArticleType.REVIEW, categorySlug: 'reviews', imageUrl: null },
  { title: 'Google Pixel Watch 3 review', slug: 'google-pixel-watch-3-review', excerpt: 'The best Wear OS watch gets a faster chip.', body: 'The Pixel Watch 3 fixes the performance issues of its predecessor with a new SoC. Battery life improves to over a day. Fit and finish are premium; the small size won\'t suit everyone.', type: ArticleType.REVIEW, categorySlug: 'reviews', imageUrl: null },
  // How-To (10)
  { title: 'How to clean your laptop keyboard', slug: 'how-to-clean-laptop-keyboard', excerpt: 'Safe steps to remove dust, crumbs, and grime from your keys.', body: 'Turn off the laptop and unplug it. Use compressed air between keys, then a soft brush. For sticky keys, lightly dampen a cloth with isopropyl alcohol. Never pour liquid directly on the keyboard.', type: ArticleType.HOW_TO, categorySlug: 'how-to', imageUrl: null },
  { title: 'How to enable Windows 11 God Mode', slug: 'how-to-enable-windows-11-god-mode', excerpt: 'Access all settings in one folder with this hidden trick.', body: 'Create a new folder and rename it to include the God Mode GUID. The folder icon will change and open to reveal hundreds of settings in one place. Useful for power users.', type: ArticleType.HOW_TO, categorySlug: 'how-to', imageUrl: null },
  { title: 'How to share files between Windows and Mac', slug: 'how-to-share-files-windows-mac', excerpt: 'Simple methods to move files across your PC and Mac.', body: 'Use a shared network folder, cloud storage like OneDrive or Google Drive, or a USB drive formatted as exFAT. For ongoing sync, consider Syncthing or a NAS.', type: ArticleType.HOW_TO, categorySlug: 'how-to', imageUrl: null },
  { title: 'How to check your GPU temperature', slug: 'how-to-check-gpu-temperature', excerpt: 'Monitor your graphics card to avoid throttling and damage.', body: 'Tools like MSI Afterburner, HWiNFO, and GPU-Z show real-time temps. Most GPUs are safe up to 80–85°C under load. Improve cooling with better case airflow or a custom fan curve.', type: ArticleType.HOW_TO, categorySlug: 'how-to', imageUrl: null },
  { title: 'How to set up dual monitors on Windows', slug: 'how-to-set-up-dual-monitors-windows', excerpt: 'Extend or duplicate your display in a few clicks.', body: 'Connect the second monitor, then open Settings > System > Display. Choose "Extend" to use both as one desktop or "Duplicate" for presentations. Arrange the icons to match physical layout.', type: ArticleType.HOW_TO, categorySlug: 'how-to', imageUrl: null },
  { title: 'How to backup your iPhone to a PC', slug: 'how-to-backup-iphone-to-pc', excerpt: 'Use iTunes or Finder to create a full backup on your computer.', body: 'Install iTunes (Windows) or use Finder (Mac). Connect the iPhone, trust the computer, and click "Back Up Now." Encrypted backups save passwords and health data. Store backups somewhere safe.', type: ArticleType.HOW_TO, categorySlug: 'how-to', imageUrl: null },
  { title: 'How to overclock your CPU safely', slug: 'how-to-overclock-cpu-safely', excerpt: 'Step-by-step guide to squeezing more performance from your processor.', body: 'Enter BIOS/UEFI and find the CPU multiplier or frequency settings. Increase in small steps, then stress-test with Prime95 or AIDA64. Monitor temperatures and voltage; don\'t exceed manufacturer limits.', type: ArticleType.HOW_TO, categorySlug: 'how-to', imageUrl: null },
  { title: 'How to remove bloatware from a new PC', slug: 'how-to-remove-bloatware-new-pc', excerpt: 'Clean up preinstalled junk from Windows out of the box.', body: 'Uninstall from Settings > Apps. For stubborn apps, use PowerShell or the BloatyNosy script. Reinstalling Windows from a clean ISO is the nuclear option for a truly clean start.', type: ArticleType.HOW_TO, categorySlug: 'how-to', imageUrl: null },
  { title: 'How to use Windows Snap Layouts', slug: 'how-to-use-windows-snap-layouts', excerpt: 'Organize windows on your screen with built-in Snap.', body: 'Hover over the Maximize button to see layout options. Drag a window to a zone to snap it. Use Win + Z for quick access. Great for comparing documents or keeping chat visible while working.', type: ArticleType.HOW_TO, categorySlug: 'how-to', imageUrl: null },
  { title: 'How to create a Windows recovery drive', slug: 'how-to-create-windows-recovery-drive', excerpt: 'Make a USB drive that can repair or reinstall Windows.', body: 'Search "Create a recovery drive" in Windows. Use a 16GB+ USB drive. The process copies recovery tools to the drive. Keep it safe—you\'ll need it if Windows won\'t boot.', type: ArticleType.HOW_TO, categorySlug: 'how-to', imageUrl: null },
  // Deals (10)
  { title: 'Best Black Friday PC deals 2025', slug: 'black-friday-pc-deals-2025', excerpt: 'We\'re tracking the top desktop and component deals.', body: 'Black Friday brings deep discounts on prebuilt PCs, GPUs, and monitors. We\'ll update this list as deals go live. Set price alerts and act fast—stock often sells out.', type: ArticleType.DEAL, categorySlug: 'deals', imageUrl: null },
  { title: 'Amazon Prime Day SSD deals', slug: 'prime-day-ssd-deals', excerpt: 'Save on NVMe and SATA SSDs during Prime Day.', body: 'Samsung, WD, and Crucial drives often drop 30–40% during Prime Day. Look for 1TB NVMe drives under $60 and 2TB under $100. Check our list for verified discounts.', type: ArticleType.DEAL, categorySlug: 'deals', imageUrl: null },
  { title: 'Student laptop deals: Back to school 2025', slug: 'student-laptop-deals-2025', excerpt: 'Discounts on Chromebooks, Windows laptops, and MacBooks for students.', body: 'Retailers and manufacturers offer education pricing year-round. Back-to-school season adds extra promos. Verify eligibility with a .edu email or student ID.', type: ArticleType.DEAL, categorySlug: 'deals', imageUrl: null },
  { title: 'Monitor deals: 4K and gaming displays', slug: 'monitor-deals-4k-gaming', excerpt: 'Curated monitor discounts updated weekly.', body: 'We track price drops on 4K productivity monitors and high-refresh gaming panels. Subscribe to our newsletter for deal alerts. Often the best prices are during seasonal sales.', type: ArticleType.DEAL, categorySlug: 'deals', imageUrl: null },
  { title: 'Gaming chair deals under $200', slug: 'gaming-chair-deals-under-200', excerpt: 'Comfortable ergonomic chairs without the premium price.', body: 'Secretlab, Herman Miller, and budget brands like GTRacing go on sale regularly. Look for lumbar support and adjustable armrests. Avoid flashy "racing" chairs with poor ergonomics.', type: ArticleType.DEAL, categorySlug: 'deals', imageUrl: null },
  { title: 'Wireless mouse and keyboard deals', slug: 'wireless-mouse-keyboard-deals', excerpt: 'Save on Logitech, Razer, and more peripherals.', body: 'Wireless combos and standalone mice often see 20–30% off during Amazon and Best Buy sales. Top picks like the MX Master and G Pro Wireless appear in deal roundups frequently.', type: ArticleType.DEAL, categorySlug: 'deals', imageUrl: null },
  { title: 'VPN deals: Lifetime and annual discounts', slug: 'vpn-deals-2025', excerpt: 'Legit VPN discounts—avoid sketchy lifetime deals.', body: 'NordVPN and ExpressVPN offer steep discounts on annual plans. Be wary of "lifetime" VPN deals from unknown brands; they often disappear. Stick to reputable providers.', type: ArticleType.DEAL, categorySlug: 'deals', imageUrl: null },
  { title: 'Refurbished MacBook deals', slug: 'refurbished-macbook-deals', excerpt: 'Save big on Apple-certified refurbished MacBooks.', body: 'Apple\'s refurbished store offers like-new machines with warranty. Third-party sellers like Back Market and Gazelle also have deals. Check battery cycle count and return policy.', type: ArticleType.DEAL, categorySlug: 'deals', imageUrl: null },
  { title: 'Graphics card deals: When to buy', slug: 'graphics-card-deals-when-to-buy', excerpt: 'Timing your GPU purchase for the best price.', body: 'GPU prices drop after new generations launch and during Black Friday. Avoid buying at launch. Set up alerts on CamelCamelCamel or Keepa to catch price drops on specific models.', type: ArticleType.DEAL, categorySlug: 'deals', imageUrl: null },
  { title: 'Software deals: Antivirus, Office, and creative apps', slug: 'software-deals-antivirus-office', excerpt: 'Legitimate discounts on subscription and perpetual software.', body: 'Microsoft 365 and Adobe Creative Cloud often have first-year discounts. Antivirus vendors run promos around the holidays. Buy from official or authorized sellers to avoid key reseller issues.', type: ArticleType.DEAL, categorySlug: 'deals', imageUrl: null },
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

  // Mock articles: insert each if slug doesn't exist yet
  const categories = await categoryRepo.find();
  const slugToId = Object.fromEntries(categories.map((cat) => [cat.slug, cat.id]));
  const now = new Date();
  let inserted = 0;

  for (const m of MOCK_ARTICLES) {
    const existing = await articleRepo.findOne({ where: { slug: m.slug } });
    if (existing) continue;

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
    inserted++;
    console.log('Created mock article:', m.slug);
  }

  if (inserted > 0) {
    console.log(`Created ${inserted} mock article(s). Total in seed: ${MOCK_ARTICLES.length}.`);
  }

  await dataSource.destroy();
  console.log('Seed done.');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
