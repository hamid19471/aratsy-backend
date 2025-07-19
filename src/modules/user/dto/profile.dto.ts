import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsString,
  Length,
} from 'class-validator';
import { Roles } from 'src/enums/role.enum';

export class ProfileDto {
  @ApiProperty()
  @IsString()
  @Length(3, 20, {
    message: 'نام و نام خانوادگی باید بیشتر از 3 و کمتر از 20 کاراکتر باشد',
  })
  full_name: string;

  @ApiProperty()
  @IsString()
  @IsEmail({}, { message: 'ایمیل معتبر نیست' })
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsMobilePhone('fa-IR', {}, { message: 'شماره موبایل معتبر نیست' })
  mobile: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsString()
  avatar: string;

  @ApiPropertyOptional()
  @IsEnum(Roles)
  role: Roles;
}
