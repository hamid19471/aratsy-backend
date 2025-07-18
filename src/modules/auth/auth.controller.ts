import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumer } from 'src/enums/swagger-consumer.enum';
import { Response } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @ApiConsumes(SwaggerConsumer.X_WWW_FORM_URLENCODED, SwaggerConsumer.JSON)
  login(@Body() loginDto: LoginDto, @Res() res: Response) {
    return this.authService.login(loginDto, res);
  }

  @Post('register')
  @ApiConsumes(SwaggerConsumer.X_WWW_FORM_URLENCODED, SwaggerConsumer.JSON)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
