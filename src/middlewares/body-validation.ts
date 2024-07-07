import { NextFunction, Response } from 'express';
import Joi from 'joi';
import { logger } from '../config';
import createError from 'http-errors';
import { IUserRequest } from '../interfaces';

export default (validationSchema: Joi.ObjectSchema) => (req: IUserRequest, res: Response, next: NextFunction) => {
  const { error } = validationSchema.validate(req.body);
  if (error) {
    logger.error('failed to validate body:', { error });

    next(createError.BadRequest(error.details[0].message));
  } else {
    next();
  }
};
