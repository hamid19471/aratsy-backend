import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ErrorMessage } from 'src/enums/error-message.enum';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { TokenPayload } from 'src/types/token-payload.type';
import { Request, Response } from 'express';
import { SuccessMessage } from 'src/enums/success-message.enum';
import { ProfileEntity } from '../user/entities/profile.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    private tokenService: TokenService,
  ) {}

  async login(loginDto: LoginDto, res: Response) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      throw new BadRequestException(ErrorMessage.INVALID_PASSWORD);
    }
    const payload: TokenPayload = {
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    };
    const access_token = this.tokenService.generateAccessToken(payload);
    const refresh_token = this.tokenService.generateRefreshToken(payload);
    this.tokenService.setCookie(res, access_token, refresh_token);
    res.json({
      message: SuccessMessage.LOGIN_SUCCESS,
    });
  }

  async register(registerDto: RegisterDto) {
    const { email, full_name, password } = registerDto;
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new BadRequestException(ErrorMessage.USER_ALREADY_EXISTS);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      full_name,
      email,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);
    const profile = this.profileRepository.create({
      email,
      full_name,
      userId: newUser.id,
    });
    await this.profileRepository.save(profile);
    await this.userRepository.update(
      { id: newUser.id },
      { profileId: profile.id },
    );
    return {
      message: SuccessMessage.USER_CREATED,
    };
  }

  async refreshToken(req: Request, res: Response) {
    const token = req.cookies['refresh_token'] as string;
    if (!token) {
      throw new UnauthorizedException(ErrorMessage.INVALID_REFRESH_TOKEN);
    }
    const { email, full_name, role } =
      this.tokenService.verifyRefreshToken(token);
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }
    const access_token = this.tokenService.generateAccessToken({
      email,
      full_name,
      role,
    });
    const refresh_token = this.tokenService.generateRefreshToken({
      email,
      full_name,
      role,
    });
    this.tokenService.setCookie(res, access_token, refresh_token);
    res.json();
  }
}
