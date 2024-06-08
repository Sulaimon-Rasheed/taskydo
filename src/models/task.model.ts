import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Task extends Model<Task> {
  @PrimaryKey
  @AutoIncrement
  @Column
  _id: number;

  @Column
  title: string;

  @Column
  description: string;

  @Column({
    type: DataType.ENUM('Pending', 'Completed'),
    allowNull: false,
  })
  status: string;

  @Column
  due_date: string;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;
}
