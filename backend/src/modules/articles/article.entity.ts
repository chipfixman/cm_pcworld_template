import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { User } from '../users/user.entity';

export enum ArticleType {
  NEWS = 'news',
  REVIEW = 'review',
  HOW_TO = 'how-to',
  DEAL = 'deal',
  BEST_PICK = 'best-pick',
}

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ length: 200 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string | null;

  @Column({ type: 'longtext' })
  body: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @Column({ type: 'enum', enum: ArticleType, default: ArticleType.NEWS })
  type: ArticleType;

  @Column({ default: true })
  published: boolean;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ type: 'int', nullable: true })
  categoryId: number | null;

  @ManyToOne(() => Category, (c) => c.articles, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: Category | null;

  @Column({ type: 'int', nullable: true })
  authorId: number | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'authorId' })
  author: User | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  publishedAt: Date | null;
}
