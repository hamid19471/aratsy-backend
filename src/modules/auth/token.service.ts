import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ErrorMessage } from 'src/enums/error-message.enum';
import { TokenPayload } from 'src/types/token-payload.type';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  generateAccessToken(payload: TokenPayload) {
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: '1h',
    });
    return access_token;
  }

  generateRefreshToken(payload: TokenPayload) {
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: '7d',
    });
    return refresh_token;
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
      }
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
      }
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
  }

  setCookie(res: Response, access_token: string, refresh_token: string) {
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }
}
