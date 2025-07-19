import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { ProfileEntity } from '../user/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity]), JwtModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenService],
  exports: [AuthService, JwtService, TokenService],
})
export class AuthModule {}
