import { UserRole } from '../enums';

export class CreateUserDto {
  firstName!: string;
  lastName!: string;
  email!: string;
  //role!: UserRole;
  token!: string;
}
