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

@Injectable()
export class CategorisService {
  constructor(
    @InjectRepository(CategorisEntity)
    private categoriesRepository: Repository<CategorisEntity>,
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

  async findAll() {
    return this.categoriesRepository.find();
  }

  async findAllSlugs() {
    const slugs = await this.categoriesRepository.find({
      select: ['slug'],
    });
    return slugs.map((slug) => slug.slug);
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
