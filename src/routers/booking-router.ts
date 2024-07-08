import { Router } from 'express';
import { authMiddleware, bodyValidationMiddleware } from '../middlewares';
import { bookingCreationSchema, bookingUpdateSchema } from '../validation-schemas';
import { BookingController } from '../controllers';
import { logger } from '../config';
import { IBookingService, IDatabaseService } from '../interfaces';

export class BookingRouter {
  private readonly path: string;
  private router!: Router;
  private controller!: BookingController;

  constructor(databaseService: IDatabaseService, bookingService: IBookingService) {
    logger.debug('BookingRouter.ctor');

    this.path = '/bookings';

    this.createController(bookingService);
    this.createRouter(databaseService);
  }

  getRoutes(): Router {
    logger.debug('BookingRouter.get routes');

    return this.router;
  }

  private createController(bookingService: IBookingService): void {
    console.log('BookingRouter.create controller');

    this.controller = new BookingController(bookingService);
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
