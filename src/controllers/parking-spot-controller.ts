import { Request, Response, NextFunction } from 'express';
import { ParkingSpotService } from '../services';
import { CreateParkingSpotDto, UpdateParkingSpotDto } from '../dtos';
import { logger } from '../config';
import { ResponseHelper } from '../utils';
import { IUserRequest } from '../interfaces';

export class ParkingSpotController {
  private parkingSpotService: ParkingSpotService;

  constructor(parkingSpotService: ParkingSpotService) {
    logger.debug('ParkingSpotController.ctor');

    this.parkingSpotService = parkingSpotService;
  }

  async createParkingSpot(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const createParkingSpotDto: CreateParkingSpotDto = req.body;

      const parkingSpot = await this.parkingSpotService.createParkingSpot(req.user!, createParkingSpotDto);

      ResponseHelper.success(res, parkingSpot, 201);
    } catch (error) {
      next(error);
    }
  }

  async getParkingSpots(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parkingSpots = await this.parkingSpotService.getParkingSpots();

      ResponseHelper.success(res, parkingSpots);
    } catch (error) {
      next(error);
    }
  }

  async getParkingSpot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parkingSpot = await this.parkingSpotService.getParkingSpot(req.params.id);

      ResponseHelper.success(res, parkingSpot);
    } catch (error) {
      next(error);
    }
  }

  async updateParkingSpot(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updateParkingSpotDto: UpdateParkingSpotDto = req.body;

      const parkingSpot = await this.parkingSpotService.updateParkingSpot(req.user!, req.params.id, updateParkingSpotDto);

      ResponseHelper.success(res, parkingSpot);
    } catch (error) {
      next(error);
    }
  }

  async deleteParkingSpot(req: IUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parkingSpot = await this.parkingSpotService.deleteParkingSpot(req.user!, req.params.id);

      ResponseHelper.success(res, parkingSpot);
    } catch (error) {
      next(error);
    }
  }
}
