import { PartialType } from '@nestjs/swagger';
import { CreateCategorisDto } from './create-categoris.dto';

export class UpdateCategorisDto extends PartialType(CreateCategorisDto) {}
