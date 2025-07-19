import { UserEntity } from 'src/modules/user/entities/user.entity';
import { TokenPayload } from './token-payload.type';

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity | TokenPayload;
    }
  }
}
