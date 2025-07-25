import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategorisDto } from './dto/create-categoris.dto';
import { UpdateCategorisDto } from './dto/update-categoris.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategorisEntity } from './entities/categoris.entity';
import { Repository } from 'typeorm';
import { ErrorMessage } from 'src/enums/error-message.enum';
import { SuccessMessage } from 'src/enums/success-message.enum';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationSolver } from 'src/common/pagination/utils/pagination.util';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CategorisService {
  constructor(
    @InjectRepository(CategorisEntity)
    private categoriesRepository: Repository<CategorisEntity>,
    private cacheService: CacheService,
  ) {}

  async create(createCategorisDto: CreateCategorisDto) {
    const { title, slug } = createCategorisDto;
    const category = await this.categoriesRepository.findOneBy({ slug });
    if (category) {
      throw new ConflictException(ErrorMessage.CATEGORY_ALREADY_EXISTS);
    }
    const newCategory = this.categoriesRepository.create({
      title,
      slug,
    });
    await this.categoriesRepository.save(newCategory);
    return {
      message: SuccessMessage.CATEGORY_CREATED,
    };
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const cacheKey = 'categories';
    const cachedCategories =
      await this.cacheService.get<CategorisEntity[]>(cacheKey);
    if (cachedCategories) {
      console.log('come from cache');
      return cachedCategories;
    }
    const { page, limit, skip } = PaginationSolver(paginationQueryDto);
    const [categories, totalItems] =
      await this.categoriesRepository.findAndCount({
        where: {},
        skip,
        take: limit,
        order: {
          created_at: 'DESC',
        },
      });
    const result = {
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
      data: categories,
    };
    await this.cacheService.set(cacheKey, result, '2h');
    return result;
  }

  async findAllSlugs() {
    const cacheKey = 'categories-slugs';
    const cachedSlugs = await this.cacheService.get<string[]>(cacheKey);
    if (cachedSlugs) {
      console.log('come from cache');
      return cachedSlugs;
    }
    const slugs = await this.categoriesRepository.find({
      select: ['slug'],
    });
    const result = slugs.map((slug) => slug.slug);
    await this.cacheService.set(cacheKey, result, '2h');
    return result;
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(ErrorMessage.CATEGORY_NOT_FOUND);
    }
    return category;
  }

  async update(id: number, updateCategorisDto: UpdateCategorisDto) {
    const { title, slug } = updateCategorisDto;
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(ErrorMessage.CATEGORY_NOT_FOUND);
    }

    if (title) {
      category.title = title;
    }
    if (slug) {
      category.slug = slug;
    }
    await this.categoriesRepository.save(category);
    return {
      message: SuccessMessage.CATEGORY_UPDATED,
    };
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(ErrorMessage.CATEGORY_NOT_FOUND);
    }
    await this.categoriesRepository.remove(category);
    return {
      message: SuccessMessage.CATEGORY_REMOVED,
    };
  }
}
