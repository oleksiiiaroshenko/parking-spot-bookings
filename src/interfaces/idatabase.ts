import { Model, WhereOptions } from 'sequelize';

export interface IDatabase<T extends Model> {
  create(data: T['_creationAttributes']): Promise<T>;
  update(record: T, data: Partial<T>): Promise<T>;
  findById(id: number): Promise<T | null>;
  findOne(where?: WhereOptions<T>): Promise<T | null>;
  findAll(where?: WhereOptions<T>): Promise<T[]>;
  delete(record: T): Promise<void>;
}
