import { Router } from 'express';
import { authMiddleware, bodyValidationMiddleware } from '../middlewares';
import { userCreationSchema, userUpdateSchema } from '../validation-schemas';
import { logger } from '../config';
import { IDatabaseService, IUserController } from '../interfaces';

export class UserRouter {
  private readonly path: string;
  private router!: Router;

  constructor(
    private readonly controller: IUserController,
    databaseService: IDatabaseService,
  ) {
    logger.debug('UserRouter.ctor');

    this.path = '/users';

    this.createRouter(databaseService);
  }

  getRoutes(): Router {
    logger.debug('UserRouter.get routes');

    return this.router;
  }

  private createRouter(databaseService: IDatabaseService): void {
    logger.debug('UserRouter.create router');

    this.router = Router();

    this.router.post(`${this.path}`, bodyValidationMiddleware(userCreationSchema), this.controller.createUser.bind(this.controller));
    this.router.get(`${this.path}`, authMiddleware(databaseService), this.controller.getUsers.bind(this.controller));
    this.router.get(`${this.path}/:id`, authMiddleware(databaseService), this.controller.getUser.bind(this.controller));
    this.router.put(
      `${this.path}/:id`,
      authMiddleware(databaseService),
      bodyValidationMiddleware(userUpdateSchema),
      this.controller.updateUser.bind(this.controller),
    );
    this.router.delete(`${this.path}/:id`, authMiddleware(databaseService), this.controller.deleteUser.bind(this.controller));
  }
}
