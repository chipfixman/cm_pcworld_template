import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { RedisService } from '../../common/redis/redis.service';
import { Article, ArticleType } from './article.entity';
import { CreateArticleDto, UpdateArticleDto, ListArticlesDto } from './dto/article.dto';

const CACHE_TTL = 300; // 5 min
const LIST_CACHE_PREFIX = 'articles:list:';
const ONE_CACHE_PREFIX = 'articles:one:';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private repo: Repository<Article>,
    private redis: RedisService,
  ) {}

  async list(query: ListArticlesDto) {
    const key = LIST_CACHE_PREFIX + JSON.stringify(query);
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached);

    const qb = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.category', 'category')
      .leftJoinAndSelect('a.author', 'author')
      .where('a.published = :published', { published: true });

    if (query.categoryId) qb.andWhere('a.categoryId = :categoryId', { categoryId: query.categoryId });
    if (query.categorySlug) qb.andWhere('category.slug = :slug', { slug: query.categorySlug });
    if (query.type) qb.andWhere('a.type = :type', { type: query.type });
    if (query.q) qb.andWhere('(a.title LIKE :q OR a.excerpt LIKE :q)', { q: `%${query.q}%` });

    qb.orderBy('a.publishedAt', 'DESC').addOrderBy('a.createdAt', 'DESC');
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 20));
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    const result = { items, total, page, limit };
    await this.redis.set(key, JSON.stringify(result), CACHE_TTL);
    return result;
  }

  async findById(id: number, incView = false) {
    const key = ONE_CACHE_PREFIX + id;
    if (!incView) {
      const cached = await this.redis.get(key);
      if (cached) return JSON.parse(cached);
    }

    const article = await this.repo.findOne({
      where: { id },
      relations: ['category', 'author'],
    });
    if (!article) return null;
    if (incView) {
      await this.repo.increment({ id }, 'viewCount', 1);
      article.viewCount += 1;
    }
    await this.redis.set(key, JSON.stringify(article), CACHE_TTL);
    return article;
  }

  async findBySlug(slug: string, incView = false) {
    const article = await this.repo.findOne({
      where: { slug, published: true },
      relations: ['category', 'author'],
    });
    if (!article) return null;
    if (incView) {
      await this.repo.increment({ id: article.id }, 'viewCount', 1);
      article.viewCount += 1;
    }
    await this.redis.del(ONE_CACHE_PREFIX + article.id);
    return article;
  }

  async create(dto: CreateArticleDto, authorId: number) {
    const article = this.repo.create({
      ...dto,
      authorId,
      publishedAt: dto.published ? new Date() : undefined,
    });
    return this.repo.save(article);
  }

  async update(id: number, dto: UpdateArticleDto) {
    const update: Partial<Article> = { ...dto };
    if (dto.published !== undefined) {
      if (dto.published) update.publishedAt = new Date();
      else update.publishedAt = null;
    }
    await this.repo.update(id, update);
    await this.redis.del(ONE_CACHE_PREFIX + id);
    return this.findById(id, false);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    await this.redis.del(ONE_CACHE_PREFIX + id);
  }

  async adminList(query: ListArticlesDto & { published?: boolean }) {
    const qb = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.category', 'category')
      .leftJoinAndSelect('a.author', 'author');

    if (query.published !== undefined) qb.andWhere('a.published = :published', { published: query.published });
    if (query.categoryId) qb.andWhere('a.categoryId = :categoryId', { categoryId: query.categoryId });
    if (query.type) qb.andWhere('a.type = :type', { type: query.type });
    if (query.q) qb.andWhere('(a.title LIKE :q OR a.excerpt LIKE :q)', { q: `%${query.q}%` });

    qb.orderBy('a.updatedAt', 'DESC');
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }
}
