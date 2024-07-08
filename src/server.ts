import express from 'express';
import { Express } from 'express';
import bodyParser from 'body-parser';
import { DatabaseService, UserService, ParkingSpotService, BookingService } from './services';
import { config, logger } from './config';
import { errorHandler } from './middlewares';
import createError from 'http-errors';
import { UserRouter, ParkingSpotRouter, BookingRouter } from './routers';
import { IBookingService, IDatabaseService, IParkingSpotService, IUserService } from './interfaces';
import { BookingController, ParkingSpotController, UserController } from './controllers';

export default class Server {
  private app!: Express;
  private databaseService!: IDatabaseService;
  private userService!: IUserService;
  private parkingSpotService!: IParkingSpotService;
  private bookingService!: IBookingService;
  private userRouter!: UserRouter;
  private parkingSpotRouter!: ParkingSpotRouter;
  private bookingRouter!: BookingRouter;
  private userController!: UserController;
  private parkingSpotController!: ParkingSpotController;
  private bookingController!: BookingController;

  constructor() {
    logger.debug('Server.ctor');

    this.validateConfig();
    this.printConfig();
    this.createServices();
    this.createControllers();
    this.createRouters();
    this.createApp();
  }

  async run() {
    logger.debug('Server.run');

    await this.initServices();

    this.start();
  }

  private validateConfig() {
    logger.debug('Server.validate config');

    config.validate({ allowed: 'strict' });
  }

  private printConfig() {
    logger.debug('Server.print config');

    logger.info('config:', config.getProperties());
  }

  private createServices() {
    logger.debug('Server.create services');

    this.databaseService = new DatabaseService();
    this.userService = new UserService(this.databaseService);
    this.parkingSpotService = new ParkingSpotService(this.databaseService);
    this.bookingService = new BookingService(this.databaseService);
  }

  private createControllers() {
    logger.debug('Server.create controllers');

    this.userController = new UserController(this.userService);
    this.parkingSpotController = new ParkingSpotController(this.parkingSpotService);
    this.bookingController = new BookingController(this.bookingService);
  }

  private createRouters() {
    logger.debug('Server.create routers');

    this.userRouter = new UserRouter(this.userController, this.databaseService);
    this.parkingSpotRouter = new ParkingSpotRouter(this.parkingSpotController, this.databaseService);
    this.bookingRouter = new BookingRouter(this.bookingController, this.databaseService);
  }

  private createApp() {
    logger.debug('Server.create app');

    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(this.userRouter.getRoutes());
    this.app.use(this.parkingSpotRouter.getRoutes());
    this.app.use(this.bookingRouter.getRoutes());
    this.app.use((req, res, next) => next(new createError.NotFound('Route not found')));
    this.app.use(errorHandler);
  }

  private async initServices() {
    logger.debug('Server.init services');

    await this.databaseService.init();
  }

  private start() {
    logger.debug('Server.start');

    const port = config.get('port');

    this.app.listen(port, () => {
      console.log(`App listen on port ${port}`);
    });
  }
}
