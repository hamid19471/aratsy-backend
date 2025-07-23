import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumer } from 'src/enums/swagger-consumer.enum';
import { AuthGuard } from 'src/guards/auth.gurd';
import { ProfileDto } from './dto/profile.dto';
import { RolesGuard } from 'src/guards/role.guard';
import { RequiredRoles } from 'src/decorators/role.decorator';
import { Roles } from 'src/enums/role.enum';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('profile')
  @UseGuards(AuthGuard)
  @ApiConsumes(SwaggerConsumer.X_WWW_FORM_URLENCODED, SwaggerConsumer.JSON)
  createProfile(@Body() profileDto: ProfileDto) {
    return this.userService.createProfile(profileDto);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @RequiredRoles(Roles.ADMIN)
  @ApiConsumes(SwaggerConsumer.X_WWW_FORM_URLENCODED, SwaggerConsumer.JSON)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @RequiredRoles(Roles.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiConsumes(SwaggerConsumer.X_WWW_FORM_URLENCODED, SwaggerConsumer.JSON)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
