import { TokenPayload } from './token-payload.type';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
