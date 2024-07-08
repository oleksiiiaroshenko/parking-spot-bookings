import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { User, ParkingSpot } from '.';

@Table({
  timestamps: true,
})
export class Booking extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @ForeignKey(() => ParkingSpot)
  @Column(DataType.INTEGER)
  declare parkingSpotId: number;

  @BelongsTo(() => ParkingSpot)
  declare parkingSpot: ParkingSpot;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare startDateTime: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare endDateTime: Date;
}
