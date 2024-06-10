import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { Task } from 'src/models/task.model';
import { AuthenticationService } from 'src/authentication/authentication.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Task])],
  controllers: [UserController],
  providers: [UserService, AuthenticationService],
})
export class UserModule {}
