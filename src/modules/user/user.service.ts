import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorMessage } from 'src/enums/error-message.enum';
import { Roles } from 'src/enums/role.enum';
import { SuccessMessage } from 'src/enums/success-message.enum';
import * as bcrypt from 'bcrypt';
import { ProfileEntity } from './entities/profile.entity';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { ProfileDto } from './dto/profile.dto';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  async createProfile(profileDto: ProfileDto) {
    const { id: userId, profileId } = this.request.user as UserEntity;
    const { email, full_name, mobile, role } = profileDto;
    let profile = await this.profileRepository.findOneBy({ userId });
    if (profile) {
      if (email) {
        profile.email = email;
      }
      if (full_name) {
        profile.full_name = full_name;
      }
      if (mobile) {
        profile.mobile = mobile;
      }
      if (role) {
        profile.role = role;
      }
      await this.profileRepository.save(profile);
    } else {
      profile = this.profileRepository.create({
        email,
        full_name,
        mobile,
        role,
      });
    }
    if (!profileId) {
      await this.userRepository.update(
        { id: userId },
        { profileId: profile?.id },
      );
    }
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, role, full_name } = createUserDto;
    const findUser = await this.findByEmail(email);
    if (findUser) {
      throw new BadRequestException(ErrorMessage.USER_ALREADY_EXISTS);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      email,
      full_name,
      password: hashedPassword,
      role: role ?? Roles.USER,
      is_active: true,
    });

    await this.userRepository.save(newUser);
    return {
      message: SuccessMessage.USER_CREATED,
      newUser,
    };
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users.map((user) => {
      return {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND_BY_ID);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { email, password, is_active, role, full_name } = updateUserDto;
    const user = await this.findOne(id);
    if (email) {
      const findUser = await this.findByEmail(email);
      if (findUser) {
        throw new BadRequestException(ErrorMessage.USER_ALREADY_EXISTS);
      }
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (full_name) {
      user.full_name = full_name;
    }
    if (is_active) {
      user.is_active = is_active;
    }
    if (role) {
      user.role = role;
    }
    await this.userRepository.save(user);
    return {
      message: SuccessMessage.USER_UPDATED,
      user,
    };
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return {
      message: SuccessMessage.USER_REMOVED,
    };
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new BadRequestException(ErrorMessage.USER_ALREADY_EXISTS);
    }
    return user;
  }
}
