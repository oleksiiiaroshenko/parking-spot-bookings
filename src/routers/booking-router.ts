import { Router } from 'express';
import { authMiddleware, bodyValidationMiddleware } from '../middlewares';
import { bookingCreationSchema, bookingUpdateSchema } from '../validation-schemas';
import { logger } from '../config';
import { IBookingController, IDatabaseService } from '../interfaces';

export class BookingRouter {
  private readonly path = '/bookings';
  private router!: Router;

  constructor(
    private readonly controller: IBookingController,
    databaseService: IDatabaseService,
  ) {
    logger.debug('BookingRouter.ctor');

    this.createRouter(databaseService);
  }

  getRoutes(): Router {
    logger.debug('BookingRouter.get routes');

    return this.router;
  }

  private createRouter(databaseService: IDatabaseService): void {
    logger.debug('BookingRouter.create router');

    this.router = Router();

    this.router.use(authMiddleware(databaseService));

    this.router.post(`${this.path}`, bodyValidationMiddleware(bookingCreationSchema), this.controller.createBooking.bind(this.controller));
    this.router.get(`${this.path}`, this.controller.getBookings.bind(this.controller));
    this.router.get(`${this.path}/:id`, this.controller.getBooking.bind(this.controller));
    this.router.put(`${this.path}/:id`, bodyValidationMiddleware(bookingUpdateSchema), this.controller.updateBooking.bind(this.controller));
    this.router.delete(`${this.path}/:id`, this.controller.deleteBooking.bind(this.controller));
  }
}
