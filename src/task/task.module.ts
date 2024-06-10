import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from 'src/models/task.model';
import { User } from 'src/models/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // imports: [TypeOrmModule.forFeature([User, Task])],
  imports: [SequelizeModule.forFeature([Task, User])],
  controllers: [TaskController],
  providers: [TaskService, AuthenticationService],
})
export class TaskModule {}
