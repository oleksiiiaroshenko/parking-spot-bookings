import { CreateBookingDto, UpdateBookingDto } from '../dtos';
import { Booking, User } from '../models';

export interface IBookingService {
  createBooking(userId: number, createBookingDto: CreateBookingDto): Promise<Booking>;
  getBookings(user: User): Promise<Booking[]>;
  getBookingById(user: User, id: string): Promise<Booking>;
  updateBooking(user: User, id: string, updateBookingDto: UpdateBookingDto): Promise<Booking>;
  deleteBooking(user: User, id: string): Promise<Booking>;
}
