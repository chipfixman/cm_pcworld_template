import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.repo.find({ order: { sortOrder: 'ASC', name: 'ASC' } });
  }

  findBySlug(slug: string): Promise<Category | null> {
    return this.repo.findOne({ where: { slug } });
  }

  findById(id: number): Promise<Category | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(dto: CreateCategoryDto): Promise<Category> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    await this.repo.update(id, dto as Partial<Category>);
    const cat = await this.findById(id);
    if (!cat) throw new Error('Category not found');
    return cat;
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
