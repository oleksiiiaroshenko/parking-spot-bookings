import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, AutoIncrement, Default } from 'sequelize-typescript';
import { User, ParkingSpot } from '.';

@Table({
  timestamps: true,
})
export class Booking extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => ParkingSpot)
  @Column(DataType.INTEGER)
  parkingSpotId!: number;

  @BelongsTo(() => ParkingSpot)
  parkingSpot!: ParkingSpot;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDateTime!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endDateTime!: Date;
}
