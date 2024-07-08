import { User, ParkingSpot } from '../models';
import { logger } from '../config';
import { CreateParkingSpotDto, UpdateParkingSpotDto } from '../dtos';
import { UserRole } from '../enums';
import createError from 'http-errors';
import { IDatabaseService, IParkingSpotService } from '../interfaces';

export class ParkingSpotService implements IParkingSpotService {
  constructor(private readonly databaseService: IDatabaseService) {
    logger.debug('ParkingSpotService.ctor');
  }

  async createParkingSpot(user: User, createParkingSpotDto: CreateParkingSpotDto): Promise<ParkingSpot> {
    logger.debug('ParkingSpotService.create parking spot:', { user, createParkingSpotDto });

    if (user.role !== UserRole.ADMIN) {
      throw new createError.Forbidden('Access denied');
    }

    const parkingSpot = await this.databaseService.parkingSpots.create(createParkingSpotDto);
    return parkingSpot;
  }

  async getParkingSpots(): Promise<ParkingSpot[]> {
    logger.debug('ParkingSpotService.get parking spots:');

    const parkingSpots = await this.databaseService.parkingSpots.findAll();
    return parkingSpots;
  }

  async getParkingSpot(id: string): Promise<ParkingSpot> {
    logger.debug('ParkingSpotService.get parking spot:', { id });

    const parkingSpot = await this.findParkingSpotById(id);
    return parkingSpot;
  }

  async updateParkingSpot(user: User, id: string, updateParkingSpotDto: UpdateParkingSpotDto): Promise<ParkingSpot> {
    logger.debug('ParkingSpotService.update parking spot:', { user, id, updateParkingSpotDto });

    if (user.role !== UserRole.ADMIN) {
      throw new createError.Forbidden('Access denied');
    }

    const parkingSpot = await this.findParkingSpotById(id);
    return this.databaseService.parkingSpots.update(parkingSpot, updateParkingSpotDto);
  }

  async deleteParkingSpot(user: User, id: string): Promise<ParkingSpot> {
    logger.debug('ParkingSpotService.delete parking spot:', { user, id });

    if (user.role !== UserRole.ADMIN) {
      throw new createError.Forbidden('Access denied');
    }

    const parkingSpot = await this.findParkingSpotById(id);
    await this.databaseService.parkingSpots.delete(parkingSpot);

    return parkingSpot;
  }

  private async findParkingSpotById(id: string): Promise<ParkingSpot> {
    logger.debug('ParkingSpotService.find parking spot by id:', { id });

    const parkingSpotId = parseInt(id, 10);
    if (isNaN(parkingSpotId)) {
      throw new createError.BadRequest('Failed to parse parking spot id');
    }

    const parkingSpot = await this.databaseService.parkingSpots.findById(parkingSpotId);
    if (!parkingSpot) {
      throw new createError.NotFound('No parking spot found');
    }

    return parkingSpot;
  }
}
