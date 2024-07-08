import { CreateUserDto, UpdateUserDto } from '../dtos';
import { User } from '../models';

export interface IUserService {
  createUser(createUserDto: CreateUserDto): Promise<User>;
  getUsers(user: User): Promise<User[]>;
  getUser(user: User, id: string): Promise<User>;
  updateUser(user: User, id: string, updateUserDto: UpdateUserDto): Promise<User>;
  deleteUser(user: User, id: string): Promise<User>;
}
