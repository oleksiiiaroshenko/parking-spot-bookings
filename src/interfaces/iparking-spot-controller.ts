import { Request, Response, NextFunction } from 'express';
import { IUserRequest } from './iuser-request';

export interface IParkingSpotController {
  createParkingSpot(req: IUserRequest, res: Response, next: NextFunction): Promise<void>;
  getParkingSpots(req: Request, res: Response, next: NextFunction): Promise<void>;
  getParkingSpot(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateParkingSpot(req: IUserRequest, res: Response, next: NextFunction): Promise<void>;
  deleteParkingSpot(req: IUserRequest, res: Response, next: NextFunction): Promise<void>;
}
