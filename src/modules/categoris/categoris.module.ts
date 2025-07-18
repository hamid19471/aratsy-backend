import { Module } from '@nestjs/common';
import { CategorisService } from './categoris.service';
import { CategorisController } from './categoris.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorisEntity } from './entities/categoris.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategorisEntity]), AuthModule],
  controllers: [CategorisController],
  providers: [CategorisService],
})
export class CategorisModule {}
