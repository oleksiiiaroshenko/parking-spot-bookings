import { Request, Response, NextFunction } from 'express';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { logger } from '../config';
import { ResponseHelper } from '../utils';
import { IUserController, IUserRequest, IUserService } from '../interfaces';

export class UserController implements IUserController {
  private readonly userService: IUserService;

  constructor(userService: IUserService) {
    logger.debug('ctor');

    this.userService = userService;
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createUserDto: CreateUserDto = req.body;

      const user = await this.userService.createUser(createUserDto);

      ResponseHelper.success(res, user, 201);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.userService.getUsers(req.user!);

      ResponseHelper.success(res, users);
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.getUser(req.user!, req.params.id);

      ResponseHelper.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updateUserDto: UpdateUserDto = req.body;

      const user = await this.userService.updateUser(req.user!, req.params.id, updateUserDto);

      ResponseHelper.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.deleteUser(req.user!, req.params.id);

      ResponseHelper.success(res, user);
    } catch (error) {
      next(error);
    }
  }
}
