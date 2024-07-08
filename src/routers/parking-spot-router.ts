import { Router } from 'express';
import { authMiddleware, bodyValidationMiddleware } from '../middlewares';
import { parkingSpotCreationSchema, parkingSpotUpdateSchema } from '../validation-schemas';
import { ParkingSpotController } from '../controllers';
import { logger } from '../config';
import { IDatabaseService, IParkingSpotService } from '../interfaces';

export class ParkingSpotRouter {
  private readonly path: string;
  private router!: Router;
  private controller!: ParkingSpotController;

  constructor(databaseService: IDatabaseService, parkingSpotService: IParkingSpotService) {
    logger.debug('ParkingSpotRouter.ctor');

    this.path = '/parking-spots';

    this.createController(parkingSpotService);
    this.createRouter(databaseService);
  }

  getRoutes(): Router {
    logger.debug('ParkingSpotRouter.get routes');

    return this.router;
  }

  private createController(parkingSpotService: IParkingSpotService): void {
    console.log('ParkingSpotRouter.create controller');

    this.controller = new ParkingSpotController(parkingSpotService);
  }

  private createRouter(databaseService: IDatabaseService): void {
    logger.debug('ParkingSpotRouter.create router');

    this.router = Router();

    this.router.post(
      `${this.path}`,
      authMiddleware(databaseService),
      bodyValidationMiddleware(parkingSpotCreationSchema),
      this.controller.createParkingSpot.bind(this.controller),
    );
    this.router.get(`${this.path}`, this.controller.getParkingSpots.bind(this.controller));
    this.router.get(`${this.path}/:id`, this.controller.getParkingSpot.bind(this.controller));
    this.router.put(
      `${this.path}/:id`,
      authMiddleware(databaseService),
      bodyValidationMiddleware(parkingSpotUpdateSchema),
      this.controller.updateParkingSpot.bind(this.controller),
    );
    this.router.delete(`${this.path}/:id`, authMiddleware(databaseService), this.controller.deleteParkingSpot.bind(this.controller));
  }
}
