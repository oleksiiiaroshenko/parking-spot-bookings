import { User } from '../models';
import { logger } from '../config';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { UserRole } from '../enums';
import { IDatabaseService, IUserService } from '../interfaces';
import createError from 'http-errors';

export class UserService implements IUserService {
  private readonly databaseService: IDatabaseService;

  constructor(databaseService: IDatabaseService) {
    logger.debug('UserService.ctor');

    this.databaseService = databaseService;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    logger.debug('UserService.create user:', { createUserDto });

    const user = await this.databaseService.users.create(createUserDto);
    return user;
  }

  async getUsers(user: User): Promise<User[]> {
    logger.debug('UserService.get users:', { user });

    if (user.role !== UserRole.ADMIN) {
      throw new createError.Forbidden('Access denied');
    }

    const users = await this.databaseService.users.findAll();
    return users;
  }

  async getUser(user: User, id: string): Promise<User> {
    logger.debug('UserService.get user:', { user, id });

    const foundUser = await this.findUserById(id);

    if (user.id !== foundUser.id && user.role !== UserRole.ADMIN) {
      throw new createError.Forbidden('Access denied');
    }

    return user;
  }

  async updateUser(user: User, id: string, updateUserDto: UpdateUserDto): Promise<User> {
    logger.debug('UserService.update user:', { user, id, updateUserDto });

    const userToUpdate = await this.findUserById(id);

    if (user.id !== userToUpdate.id && user.role !== UserRole.ADMIN) {
      throw new createError.Forbidden('Access denied');
    }

    if (user.role !== UserRole.ADMIN && updateUserDto.role) {
      throw new createError.Forbidden('Access denied');
    }

    if (user.role !== UserRole.ADMIN && updateUserDto.token) {
      throw new createError.Forbidden('Access denied');
    }

    return this.databaseService.users.update(userToUpdate, updateUserDto);
  }

  async deleteUser(user: User, id: string): Promise<User> {
    logger.debug('UserService.delete user:', { user, id });

    if (user.role !== UserRole.ADMIN) {
      throw new createError.Forbidden('Access denied');
    }

    const userToDelete = await this.findUserById(id);
    await this.databaseService.users.delete(userToDelete);

    return userToDelete;
  }

  private async findUserById(id: string): Promise<User> {
    logger.debug('UserService.find user by id:', { id });

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new createError.BadRequest('Failed to parse user id');
    }

    const user = await this.databaseService.users.findById(userId);
    if (!user) {
      throw new createError.NotFound('No user found');
    }

    return user;
  }
}
