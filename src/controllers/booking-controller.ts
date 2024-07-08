import { Response, NextFunction } from 'express';
import { CreateBookingDto, UpdateBookingDto } from '../dtos';
import { logger } from '../config';
import { ResponseHelper } from '../utils';
import { IBookingService, IUserRequest } from '../interfaces';

export class BookingController {
  private bookingService: IBookingService;

  constructor(bookingService: IBookingService) {
    logger.debug('ctor');

    this.bookingService = bookingService;
  }

  async createBooking(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const createBookingDto: CreateBookingDto = {
        ...req.body,
        startDateTime: new Date(req.body.startDateTime),
        endDateTime: new Date(req.body.endDateTime),
      };

      const booking = await this.bookingService.createBooking(req.user!.id, createBookingDto);

      ResponseHelper.success(res, booking, 201);
    } catch (error) {
      next(error);
    }
  }

  async getBookings(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const bookings = await this.bookingService.getBookings(req.user!);

      ResponseHelper.success(res, bookings);
    } catch (error) {
      next(error);
    }
  }

  async getBooking(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const booking = await this.bookingService.getBookingById(req.user!, req.params.id);

      ResponseHelper.success(res, booking);
    } catch (error) {
      next(error);
    }
  }

  async updateBooking(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updateBookingDto: UpdateBookingDto = {
        ...req.body,
        endDateTime: new Date(req.body.endDateTime),
      };

      const booking = await this.bookingService.updateBooking(req.user!, req.params.id, updateBookingDto);

      ResponseHelper.success(res, booking);
    } catch (error) {
      next(error);
    }
  }

  async deleteBooking(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const booking = await this.bookingService.deleteBooking(req.user!, req.params.id);

      ResponseHelper.success(res, booking);
    } catch (error) {
      next(error);
    }
  }
}
