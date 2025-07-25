import { Module } from '@nestjs/common';
import { CategorisService } from './categoris.service';
import { CategorisController } from './categoris.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorisEntity } from './entities/categoris.entity';
import { AuthModule } from '../auth/auth.module';
import { CacheService } from '../cache/cache.service';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategorisEntity]),
    AuthModule,
    CacheModule,
  ],
  controllers: [CategorisController],
  providers: [CategorisService, CacheService],
  exports: [CategorisService],
})
export class CategorisModule {}
