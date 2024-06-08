import {
  AutoIncrement,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Task } from './task.model';
@Table
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  _id: number;

  @Column
  userName: string;

  @Column
  email: string;

  @Column
  password: string;

  @HasMany(() => Task)
  tasks: Task[];

  @Column
  taskIds: string;
}
