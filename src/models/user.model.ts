import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
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

  @Column({
    type:DataType.STRING,
    allowNull:true
  })
  passwordResetLink: string;

  @Column({
    type:DataType.DATE,
    allowNull:true
  })
  passwordResetLinkExpiringDate: Date;
}
