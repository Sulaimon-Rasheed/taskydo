import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
dotenv.config();
import { User } from './models/user.model';
import { Task } from './models/task.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect:process.env.DB_DIALECT as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      models: [User, Task],
      logging: console.log, 
    }),
  ]
})
export class DatabaseModule {}

