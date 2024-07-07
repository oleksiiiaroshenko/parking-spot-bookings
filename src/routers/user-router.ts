import { Router } from 'express';
import { authMiddleware, bodyValidationMiddleware } from '../middlewares';
import { UserService, DatabaseService } from '../services';
import { userCreationSchema, userUpdateSchema } from '../validation-schemas';
import { UserController } from '../controllers';
import { logger } from '../config';

export class UserRouter {
  private router!: Router;
  private controller!: UserController;

  constructor(databaseService: DatabaseService, userService: UserService) {
    logger.debug('UserRouter.ctor');

    this.createController(userService);
    this.createRouter(databaseService);
  }

  getRoutes(): Router {
    logger.debug('UserRouter.get routes');

    return this.router;
  }

  private createController(userService: UserService): void {
    console.log('UserRouter.create controller');

    this.controller = new UserController(userService);
  }

  private createRouter(databaseService: DatabaseService): void {
    logger.debug('UserRouter.create router');

    this.router = Router();

    this.router.post('/users', bodyValidationMiddleware(userCreationSchema), this.controller.createUser.bind(this.controller));
    this.router.get('/users', authMiddleware(databaseService), this.controller.getUsers.bind(this.controller));
    this.router.get('/users/:id', authMiddleware(databaseService), this.controller.getUser.bind(this.controller));
    this.router.put(
      '/users/:id',
      authMiddleware(databaseService),
      bodyValidationMiddleware(userUpdateSchema),
      this.controller.updateUser.bind(this.controller),
    );
    this.router.delete('/users/:id', authMiddleware(databaseService), this.controller.deleteUser.bind(this.controller));
  }
}
