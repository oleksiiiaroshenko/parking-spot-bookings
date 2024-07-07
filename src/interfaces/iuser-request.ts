import { Request } from 'express';
import { User } from '../models';

export interface IUserRequest extends Request {
  user?: User;
}
