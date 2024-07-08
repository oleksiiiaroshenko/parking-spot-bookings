import { BookingService } from '../../src/services';
import { CreateBookingDto, UpdateBookingDto } from '../../src/dtos';
import { UserRole } from '../../src/enums';
import createError from 'http-errors';
import { User, Booking, ParkingSpot } from '../../src/models';
import { IDatabaseService, IDatabase } from '../../src/interfaces';

describe('BookingService', () => {
  let bookingService: BookingService;
  let mockDatabaseService: jest.Mocked<IDatabaseService>;

  beforeEach(() => {
    const mockBookingDatabase: jest.Mocked<IDatabase<Booking>> = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    const mockParkingSpotDatabase: jest.Mocked<IDatabase<ParkingSpot>> = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    const mockUserDatabase: jest.Mocked<IDatabase<User>> = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    mockDatabaseService = {
      users: mockUserDatabase,
      parkingSpots: mockParkingSpotDatabase,
      bookings: mockBookingDatabase,
      init: jest.fn(),
    };

    bookingService = new BookingService(mockDatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      const userId = 1;
      const createBookingDto: CreateBookingDto = {
        parkingSpotId: 1,
        startDateTime: new Date(),
        endDateTime: new Date(),
      };
      const mockBooking = { id: 1, ...createBookingDto, userId };

      (mockDatabaseService.parkingSpots.findById as jest.Mock).mockResolvedValue({} as ParkingSpot);
      (mockDatabaseService.bookings.create as jest.Mock).mockResolvedValue(mockBooking);

      const result = await bookingService.createBooking(userId, createBookingDto);

      expect(result).toEqual(mockBooking);
      expect(mockDatabaseService.parkingSpots.findById).toHaveBeenCalledWith(createBookingDto.parkingSpotId);
      expect(mockDatabaseService.bookings.create).toHaveBeenCalledWith({ userId, ...createBookingDto });
    });

    it('should throw an error if parking spot id is invalid', async () => {
      const userId = 1;
      const createBookingDto: CreateBookingDto = {
        parkingSpotId: 1,
        startDateTime: new Date(),
        endDateTime: new Date(),
      };

      (mockDatabaseService.parkingSpots.findById as jest.Mock).mockResolvedValue(null);

      await expect(bookingService.createBooking(userId, createBookingDto)).rejects.toThrow(createError.BadRequest('Invalid parking spot id'));

      expect(mockDatabaseService.parkingSpots.findById).toHaveBeenCalledWith(createBookingDto.parkingSpotId);
      expect(mockDatabaseService.bookings.create).not.toHaveBeenCalled();
    });
  });

  describe('getBookings', () => {
    it('should get all bookings for admin user', async () => {
      const adminUser: User = { id: 1, role: UserRole.ADMIN } as User;
      const mockBookings: Booking[] = [{ id: 1, userId: 1 } as Booking];

      (mockDatabaseService.bookings.findAll as jest.Mock).mockResolvedValue(mockBookings);

      const result = await bookingService.getBookings(adminUser);

      expect(result).toEqual(mockBookings);
      expect(mockDatabaseService.bookings.findAll).toHaveBeenCalledWith({});
    });

    it('should get bookings for regular user', async () => {
      const standardUser: User = { id: 1, role: UserRole.STANDARD } as User;
      const mockBookings: Booking[] = [{ id: 1, userId: 1 } as Booking];

      (mockDatabaseService.bookings.findAll as jest.Mock).mockResolvedValue(mockBookings);

      const result = await bookingService.getBookings(standardUser);

      expect(result).toEqual(mockBookings);
      expect(mockDatabaseService.bookings.findAll).toHaveBeenCalledWith({ userId: standardUser.id });
    });
  });

  describe('getBookingById', () => {
    it('should get booking by id for admin user', async () => {
      const adminUser: User = { id: 1, role: UserRole.ADMIN } as User;
      const mockBooking: Booking = { id: 1, userId: 2 } as Booking;

      (mockDatabaseService.bookings.findById as jest.Mock).mockResolvedValue(mockBooking);

      const result = await bookingService.getBookingById(adminUser, '1');

      expect(result).toEqual(mockBooking);
      expect(mockDatabaseService.bookings.findById).toHaveBeenCalledWith(1);
    });

    it('should get booking by id for the owner of the booking', async () => {
      const standardUser: User = { id: 1, role: UserRole.STANDARD } as User;
      const mockBooking: Booking = { id: 1, userId: 1 } as Booking;

      (mockDatabaseService.bookings.findById as jest.Mock).mockResolvedValue(mockBooking);

      const result = await bookingService.getBookingById(standardUser, '1');

      expect(result).toEqual(mockBooking);
      expect(mockDatabaseService.bookings.findById).toHaveBeenCalledWith(1);
    });

    it("should throw an error if a regular user tries to access another user's booking", async () => {
      const standardUser: User = { id: 1, role: UserRole.STANDARD } as User;
      const mockBooking: Booking = { id: 1, userId: 2 } as Booking;

      (mockDatabaseService.bookings.findById as jest.Mock).mockResolvedValue(mockBooking);

      await expect(bookingService.getBookingById(standardUser, '1')).rejects.toThrow(createError.Forbidden('Access denied'));

      expect(mockDatabaseService.bookings.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateBooking', () => {
    it('should update booking for the owner of the booking', async () => {
      const standardUser: User = { id: 1, role: UserRole.STANDARD } as User;
      const mockBooking: Booking = { id: 1, userId: 1, startDateTime: new Date(), endDateTime: new Date() } as Booking;
      const updateBookingDto: UpdateBookingDto = { endDateTime: new Date(mockBooking.startDateTime.getTime() + 3600000) };

      (mockDatabaseService.bookings.findById as jest.Mock).mockResolvedValue(mockBooking);
      (mockDatabaseService.bookings.update as jest.Mock).mockResolvedValue({ ...mockBooking, ...updateBookingDto });

      const result = await bookingService.updateBooking(standardUser, '1', updateBookingDto);

      expect(result).toEqual({ ...mockBooking, ...updateBookingDto });
      expect(mockDatabaseService.bookings.findById).toHaveBeenCalledWith(1);
      expect(mockDatabaseService.bookings.update).toHaveBeenCalledWith(mockBooking, updateBookingDto);
    });

    it('should throw an error if end date time is before start date time', async () => {
      const standardUser: User = { id: 1, role: UserRole.STANDARD } as User;
      const mockBooking: Booking = { id: 1, userId: 1, startDateTime: new Date(), endDateTime: new Date() } as Booking;
      const updateBookingDto: UpdateBookingDto = { endDateTime: new Date(mockBooking.startDateTime.getTime() - 3600000) };

      (mockDatabaseService.bookings.findById as jest.Mock).mockResolvedValue(mockBooking);

      await expect(bookingService.updateBooking(standardUser, '1', updateBookingDto)).rejects.toThrow(
        createError.BadRequest('End date time cannot be before start date'),
      );

      expect(mockDatabaseService.bookings.findById).toHaveBeenCalledWith(1);
      expect(mockDatabaseService.bookings.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteBooking', () => {
    it('should delete booking for the owner of the booking', async () => {
      const standardUser: User = { id: 1, role: UserRole.STANDARD } as User;
      const mockBooking: Booking = { id: 1, userId: 1 } as Booking;

      (mockDatabaseService.bookings.findById as jest.Mock).mockResolvedValue(mockBooking);

      const result = await bookingService.deleteBooking(standardUser, '1');

      expect(result).toEqual(mockBooking);
      expect(mockDatabaseService.bookings.findById).toHaveBeenCalledWith(1);
      expect(mockDatabaseService.bookings.delete).toHaveBeenCalledWith(mockBooking);
    });

    it("should throw an error if a regular user tries to delete another user's booking", async () => {
      const standardUser: User = { id: 1, role: UserRole.STANDARD } as User;
      const mockBooking: Booking = { id: 1, userId: 2 } as Booking;

      (mockDatabaseService.bookings.findById as jest.Mock).mockResolvedValue(mockBooking);

      await expect(bookingService.deleteBooking(standardUser, '1')).rejects.toThrow(createError.Forbidden('Access denied'));

      expect(mockDatabaseService.bookings.findById).toHaveBeenCalledWith(1);
      expect(mockDatabaseService.bookings.delete).not.toHaveBeenCalled();
    });
  });
});
