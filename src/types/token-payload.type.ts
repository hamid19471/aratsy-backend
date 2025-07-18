import { Roles } from 'src/enums/role.enum';

export type TokenPayload = {
  full_name: string;
  email: string;
  role: Roles;
};
