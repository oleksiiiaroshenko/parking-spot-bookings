import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Booking } from '.';

@Table({
  timestamps: false,
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  token!: string;

  @HasMany(() => Booking)
  bookings!: Booking[];
}
