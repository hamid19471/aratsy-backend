import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ErrorMessage } from 'src/enums/error-message.enum';
import { TokenService } from 'src/modules/auth/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const access_token = (request.cookies as Record<string, string>)[
      'access_token'
    ];
    if (!access_token) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    try {
      const decodeToken = this.tokenService.verifyAccessToken(access_token);
      request.user = decodeToken;
      return true;
    } catch (error: unknown) {
      throw new UnauthorizedException(
        ErrorMessage.UNAUTHORIZED,
        error as string,
      );
    }
  }
}
