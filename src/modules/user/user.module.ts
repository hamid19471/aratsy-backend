import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { TokenService } from '../auth/token.service';
import { JwtService } from '@nestjs/jwt';
import { ProfileEntity } from './entities/profile.entity';
import { CacheService } from '../cache/cache.service';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity]), CacheModule],
  controllers: [UserController],
  providers: [UserService, TokenService, JwtService, CacheService],
  exports: [UserService, TokenService, JwtService, CacheService],
})
export class UserModule {}
