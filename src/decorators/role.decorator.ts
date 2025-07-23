import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/enums/role.enum';

export const ROLES_KEY = 'roles';
export const RequiredRoles = (...roles: Roles[]) =>
  SetMetadata(ROLES_KEY, roles);
