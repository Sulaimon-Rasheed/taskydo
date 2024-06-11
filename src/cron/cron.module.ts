import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { TaskService } from 'src/task/task.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from 'src/models/task.model';
import { User } from 'src/models/user.model';
import { WinstonLoggerService } from 'src/logger/logger.service';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { CacheService } from 'src/cache/cache.service';
import { DatabaseModule } from 'src/database.module';

@Module({
    imports: [SequelizeModule.forFeature([Task, User]), DatabaseModule],
    providers: [CronService, TaskService, WinstonLoggerService, AuthenticationService, CacheService],
    exports: [CronService],
  })
  export class CronModule {}