import { Booking, ParkingSpot, User } from '../models';
import { IDatabase } from './idatabase';

export interface IDatabaseService {
  users: IDatabase<User>;
  parkingSpots: IDatabase<ParkingSpot>;
  bookings: IDatabase<Booking>;

  init(): Promise<void>;
}
