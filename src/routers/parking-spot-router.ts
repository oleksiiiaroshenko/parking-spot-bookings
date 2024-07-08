import { Router } from 'express';
import { authMiddleware, bodyValidationMiddleware } from '../middlewares';
import { parkingSpotCreationSchema, parkingSpotUpdateSchema } from '../validation-schemas';
import { logger } from '../config';
import { IDatabaseService, IParkingSpotController } from '../interfaces';

export class ParkingSpotRouter {
  private readonly path = '/parking-spots';
  private router!: Router;

  constructor(
    private readonly controller: IParkingSpotController,
    databaseService: IDatabaseService,
  ) {
    logger.debug('ParkingSpotRouter.ctor');

    this.createRouter(databaseService);
  }

  getRoutes(): Router {
    logger.debug('ParkingSpotRouter.get routes');

    return this.router;
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
