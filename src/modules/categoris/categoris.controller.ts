import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CategorisService } from './categoris.service';
import { CreateCategorisDto } from './dto/create-categoris.dto';
import { UpdateCategorisDto } from './dto/update-categoris.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.gurd';
import { SwaggerConsumer } from 'src/enums/swagger-consumer.enum';
import { Pagination } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

@Controller('categoris')
@ApiTags('Categoris')
export class CategorisController {
  constructor(private readonly categorisService: CategorisService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiConsumes(SwaggerConsumer.X_WWW_FORM_URLENCODED, SwaggerConsumer.JSON)
  create(@Body() createCategorisDto: CreateCategorisDto) {
    return this.categorisService.create(createCategorisDto);
  }

  @Get()
  @Pagination()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.categorisService.findAll(paginationQueryDto);
  }

  @Get('slugs')
  findAllSlugs() {
    return this.categorisService.findAllSlugs();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categorisService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiConsumes(SwaggerConsumer.X_WWW_FORM_URLENCODED, SwaggerConsumer.JSON)
  update(
    @Param('id') id: string,
    @Body() updateCategorisDto: UpdateCategorisDto,
  ) {
    return this.categorisService.update(+id, updateCategorisDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.categorisService.remove(+id);
  }
}
