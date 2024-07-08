import { Model, ModelCtor, Sequelize } from 'sequelize-typescript';
import { User, Booking, ParkingSpot } from '../models';
import { config, logger } from '../config';

import createError from 'http-errors';
import { WhereOptions } from 'sequelize';
import { IDatabase, IDatabaseService } from '../interfaces';

class Database<T extends Model> implements IDatabase<T> {
  private readonly model: ModelCtor<T>;

  constructor(model: ModelCtor<T>) {
    this.model = model;
  }

  async create(data: T['_creationAttributes']): Promise<T> {
    logger.debug('Database.create:', { data });

    try {
      const record = await this.model.create(data);
      return record as T;
    } catch (error) {
      logger.error('Database.failed to create:', { error });
      throw new createError.InternalServerError('Failed to create record');
    }
  }

  async update(record: T, data: Partial<T>): Promise<T> {
    logger.debug('Database.update:', { record, data });

    try {
      await record.update(data);
      return record;
    } catch (error) {
      logger.error('Database.failed to update:', { error });
      throw new createError.InternalServerError('Failed to update record');
    }
  }

  async findById(id: number): Promise<T | null> {
    logger.debug('Database.find:', { id });

    try {
      const record = await this.model.findByPk(id);
      return record as T;
    } catch (error) {
      logger.error('Database.failed to find:', { error });
      throw new createError.InternalServerError('Failed to find record');
    }
  }

  async findOne(where?: WhereOptions<T>): Promise<T | null> {
    logger.debug('Database.find one:', { where });

    try {
      const record = await this.model.findOne({ where });
      return record;
    } catch (error) {
      logger.error('Database.failed to find all:', { error });
      throw new createError.InternalServerError('Failed to find record');
    }
  }

  async findAll(where?: WhereOptions<T>): Promise<T[]> {
    logger.debug('Database.findAll');

    try {
      const records = await this.model.findAll({ where });
      return records as T[];
    } catch (error) {
      logger.error('Database.failed to find all:', { error });
      throw new createError.InternalServerError('Failed to find records');
    }
  }

  async delete(record: T): Promise<void> {
    logger.debug('Database.delete:', { record });

    try {
      await record.destroy();
    } catch (error) {
      logger.error('Database.failed to delete:', { error });
      throw new createError.InternalServerError('Failed to delete record');
    }
  }
}

export class DatabaseService implements IDatabaseService {
  private readonly sequelize: Sequelize;
  private readonly _users: Database<User>;
  private readonly _parkingSpots: Database<ParkingSpot>;
  private readonly _bookings: Database<Booking>;

  constructor() {
    logger.debug('DatabaseService.ctor');

    this.sequelize = new Sequelize({
      database: config.get('db.name'),
      dialect: 'postgres',
      username: config.get('db.user'),
      password: config.get('db.password'),
      host: config.get('db.host'),
      port: config.get('db.port'),
      models: [User, Booking, ParkingSpot],
    });

    this._users = new Database(User);
    this._parkingSpots = new Database(ParkingSpot);
    this._bookings = new Database(Booking);
  }

  async init(): Promise<void> {
    logger.debug('DatabaseService.init');

    try {
      await this.sequelize.sync();

      logger.info('DatabaseService.database initialized successfully');
    } catch (error) {
      logger.error('DatabaseService.failed to initialize database:', { error });

      throw new createError.InternalServerError('Failed to initialize database');
    }
  }

  get users(): IDatabase<User> {
    return this._users;
  }

  get parkingSpots(): IDatabase<ParkingSpot> {
    return this._parkingSpots;
  }

  get bookings(): IDatabase<Booking> {
    return this._bookings;
  }
}
