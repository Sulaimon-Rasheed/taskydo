import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();
import { User } from './models/user.model';
import { Task } from './models/task.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // imports: [
  //   ConfigModule.forRoot({
  //     isGlobal: true,
  //   }),
  //   TypeOrmModule.forRoot({
  //     type: 'mysql',
  //     host: process.env.DB_HOST,
  //     port: parseInt(process.env.DB_PORT, 10),
  //     username: process.env.DB_USER,
  //     password: process.env.DB_PASSWORD,
  //     database: process.env.DB_NAME,
  //     entities: [User, Task],
  //     synchronize: true, // Set to false in production
  //   }),
  //   TypeOrmModule.forFeature([User, Task]),
  // ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    SequelizeModule.forFeature([User, Task]),
  ],
  
})
export class DatabaseModule {}

