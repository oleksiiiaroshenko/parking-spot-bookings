import { Router } from 'express';
import { authMiddleware, bodyValidationMiddleware } from '../middlewares';
import { BookingService, DatabaseService } from '../services';
import { bookingCreationSchema, bookingUpdateSchema } from '../validation-schemas';
import { BookingController } from '../controllers';
import { logger } from '../config';

export class BookingRouter {
  private router!: Router;
  private controller!: BookingController;

  constructor(databaseService: DatabaseService, bookingService: BookingService) {
    logger.debug('BookingRouter.ctor');

    this.createController(bookingService);
    this.createRouter(databaseService);
  }

  getRoutes(): Router {
    logger.debug('BookingRouter.get routes');

    return this.router;
  }

  private createController(bookingService: BookingService): void {
    console.log('BookingRouter.create controller');

    this.controller = new BookingController(bookingService);
  }

  private createRouter(databaseService: DatabaseService): void {
    logger.debug('BookingRouter.create router');

    this.router = Router();

    this.router.use(authMiddleware(databaseService));

    this.router.post('/bookings', bodyValidationMiddleware(bookingCreationSchema), this.controller.createBooking.bind(this.controller));
    this.router.get('/bookings', this.controller.getBookings.bind(this.controller));
    this.router.get('/bookings/:id', this.controller.getBooking.bind(this.controller));
    this.router.put('/bookings/:id', bodyValidationMiddleware(bookingUpdateSchema), this.controller.updateBooking.bind(this.controller));
    this.router.delete('/bookings/:id', this.controller.deleteBooking.bind(this.controller));
  }
}
