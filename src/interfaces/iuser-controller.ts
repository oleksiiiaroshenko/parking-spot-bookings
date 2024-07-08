import { Request, Response, NextFunction } from 'express';
import { IUserRequest } from './iuser-request';

export interface IUserController {
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUsers(req: IUserRequest, res: Response, next: NextFunction): Promise<void>;
  getUser(req: IUserRequest, res: Response, next: NextFunction): Promise<void>;
  updateUser(req: IUserRequest, res: Response, next: NextFunction): Promise<void>;
  deleteUser(req: IUserRequest, res: Response, next: NextFunction): Promise<void>;
}
