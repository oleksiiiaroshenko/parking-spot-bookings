import { CreateParkingSpotDto, UpdateParkingSpotDto } from '../dtos';
import { ParkingSpot, User } from '../models';

export interface IParkingSpotService {
  createParkingSpot(user: User, createParkingSpotDto: CreateParkingSpotDto): Promise<ParkingSpot>;
  getParkingSpots(): Promise<ParkingSpot[]>;
  getParkingSpot(id: string): Promise<ParkingSpot>;
  updateParkingSpot(user: User, id: string, updateParkingSpotDto: UpdateParkingSpotDto): Promise<ParkingSpot>;
  deleteParkingSpot(user: User, id: string): Promise<ParkingSpot>;
}
