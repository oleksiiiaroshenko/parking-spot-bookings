import { User, Booking } from '../models';
import { logger } from '../config';
import { CreateBookingDto, UpdateBookingDto } from '../dtos';
import { UserRole } from '../enums';
import createError from 'http-errors';
import { IBookingService, IDatabaseService } from '../interfaces';

export class BookingService implements IBookingService {
  private readonly databaseService: IDatabaseService;

  constructor(databaseService: IDatabaseService) {
    logger.debug('BookingService.ctor');

    this.databaseService = databaseService;
  }

  async createBooking(userId: number, createBookingDto: CreateBookingDto): Promise<Booking> {
    logger.debug('BookingService.create booking:', { userId, createBookingDto });

    const parkingSpot = await this.databaseService.parkingSpots.findById(createBookingDto.parkingSpotId);
    if (!parkingSpot) {
      throw new createError.BadRequest('Invalid parking spot id');
    }

    const booking = await this.databaseService.bookings.create({ userId, ...createBookingDto });
    return booking;
  }

  async getBookings(user: User): Promise<Booking[]> {
    logger.debug('BookingService.get bookings:', { user });

    const whereOptions = user.role === UserRole.ADMIN ? {} : { userId: user.id };
    const bookings = await this.databaseService.bookings.findAll(whereOptions);

    return bookings;
  }

  async getBookingById(user: User, id: string): Promise<Booking> {
    logger.debug('BookingService.get booking by id:', { user, id });

    const booking = await this.findBookingById(id);

    if (user.role !== UserRole.ADMIN && booking.userId !== user.id) {
      throw new createError.Forbidden('Access denied');
    }

    return booking;
  }

  async updateBooking(user: User, id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    logger.debug('BookingService.update booking:', { user, id, updateBookingDto });

    const booking = await this.findBookingById(id);

    if (booking.userId !== user.id && user.role !== UserRole.ADMIN) {
      throw new createError.Forbidden('Access denied');
    }

    if (updateBookingDto.endDateTime < booking.startDateTime) {
      throw new createError.BadRequest('End date time cannot be before start date');
    }

    return this.databaseService.bookings.update(booking, updateBookingDto);
  }

  async deleteBooking(user: User, id: string): Promise<Booking> {
    logger.debug('BookingService.delete booking:', { user, id });

    const booking = await this.findBookingById(id);

    if (booking.userId !== user.id && user.role !== UserRole.ADMIN) {
      throw new createError.Forbidden('Access denied');
    }

    await this.databaseService.bookings.delete(booking);

    return booking;
  }

  private async findBookingById(id: string): Promise<Booking> {
    logger.debug('BookingService.find booking by id:', { id });

    const bookingId = parseInt(id, 10);
    if (isNaN(bookingId)) {
      throw new createError.BadRequest('Failed to parse booking id');
    }

    const booking = await this.databaseService.bookings.findById(bookingId);
    if (!booking) {
      throw new createError.NotFound('No booking found');
    }

    return booking;
  }
}
