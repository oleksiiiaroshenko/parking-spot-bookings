import { Response, NextFunction } from 'express';
import { logger } from '../config';
import createError from 'http-errors';
import { DatabaseService } from '../services';
import { IUserRequest } from '../interfaces';

export default (databaseService: DatabaseService) => async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      logger.warn('no token provided');

      throw new createError.Unauthorized('Access denied');
    }

    const user = await databaseService.users.findOne({ token });
    if (!user) {
      logger.warn('invalid token:', { token });

      throw new createError.Unauthorized('Access denied');
    }

    req.user = user;

    logger.info('user authenticated:', { user });

    next();
  } catch (error) {
    next(error);
  }
};
