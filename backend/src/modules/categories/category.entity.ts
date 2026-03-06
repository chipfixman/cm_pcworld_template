import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// import { Article } from '../articles/article.entity';

export enum CategorySlug {
  NEWS = 'news',
  BEST_PICKS = 'best-picks',
  REVIEWS = 'reviews',
  HOW_TO = 'how-to',
  DEALS = 'deals',
  LAPTOPS = 'laptops',
  GAMING = 'gaming',
  WINDOWS = 'windows',
  SECURITY = 'security',
  ACCESSORIES = 'accessories',
  MOBILE = 'mobile',
  MONITORS = 'monitors',
  PC_COMPONENTS = 'pc-components',
  SOFTWARE = 'software',
  STORAGE = 'storage',
  STREAMING = 'streaming',
  WIFI_NETWORKS = 'wifi-networks',
  OTHER = 'other',
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 80 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ default: 0 })
  sortOrder: number;

  /** @OneToMany(() => Article, (a) => a.category) **/
  /** articles: Article[]; **/
}
