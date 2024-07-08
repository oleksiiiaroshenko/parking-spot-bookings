import { UserRole } from '../enums';

export type UpdateUserDto = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  token?: string;
};
