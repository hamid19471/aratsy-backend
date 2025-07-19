import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { TokenService } from '../auth/token.service';
import { JwtService } from '@nestjs/jwt';
import { ProfileEntity } from './entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity])],
  controllers: [UserController],
  providers: [UserService, TokenService, JwtService],
  exports: [UserService, TokenService, JwtService],
})
export class UserModule {}
