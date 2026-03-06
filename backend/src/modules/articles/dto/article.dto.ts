import { IsString, IsOptional, IsBoolean, IsInt, IsEnum, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleType } from '../article.entity';

export class CreateArticleDto {
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  slug: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @IsOptional()
  @IsEnum(ArticleType)
  type?: ArticleType;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  published?: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoryId?: number;
}

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  slug?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @IsOptional()
  @IsEnum(ArticleType)
  type?: ArticleType;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  published?: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoryId?: number;
}

export class ListArticlesDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @IsString()
  categorySlug?: string;

  @IsOptional()
  @IsEnum(ArticleType)
  type?: ArticleType;

  @IsOptional()
  @IsString()
  q?: string;
}
