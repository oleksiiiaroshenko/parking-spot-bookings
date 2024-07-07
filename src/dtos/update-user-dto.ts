import { UserRole } from '../enums';

export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  token?: string;
}
