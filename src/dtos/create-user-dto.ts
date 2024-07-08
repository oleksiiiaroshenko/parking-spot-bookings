import { UserRole } from '../enums';

export type CreateUserDto = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  token: string;
};
