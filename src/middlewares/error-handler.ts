import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import { logger } from '../config';
import { ResponseHelper } from '../utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (error: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error({ error });

  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  ResponseHelper.failure(res, status, message);
};
