import { Response, NextFunction } from 'express';
import { IUserRequest } from './iuser-request';

export interface IBookingController {
  createBooking(req: IUserRequest, res: Response, next: NextFunction): Promise<void>;
  getBookings(req: IUserRequest, res: Response, next: NextFunction): Promise<void>;
  getBooking(req: IUserRequest, res: Response, next: NextFunction): Promise<void>;
  updateBooking(req: IUserRequest, res: Response, next: NextFunction): Promise<void>;
  deleteBooking(req: IUserRequest, res: Response, next: NextFunction): Promise<void>;
}
