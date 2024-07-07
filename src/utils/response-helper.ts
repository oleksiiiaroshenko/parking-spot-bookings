import { Response } from 'express';

export class ResponseHelper {
  static success<T>(res: Response, data: T, statusCode: number = 200) {
    return res.status(statusCode).json({
      status: 'success',
      data,
    });
  }

  static failure(res: Response, statusCode: number, error: string) {
    return res.status(statusCode).json({
      status: 'error',
      error,
    });
  }
}
