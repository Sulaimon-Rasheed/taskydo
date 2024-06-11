import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { GlobalExceptionFilter } from './globalError/global.filter';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { AuthenticationService } from './authentication/authentication.service';
import { CacheService } from './cache/cache.service';
import { WinstonLoggerService } from './logger/logger.service';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { TaskService } from './task/task.service';

@Module({
  imports: [
    DatabaseModule,
    ThrottlerModule.forRoot([{ ttl: 60 * 1000, limit: 10 }]),
    UserModule,
    TaskModule,
    CronModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    AuthenticationService,
    CacheService,
    WinstonLoggerService,
    CronService,
    TaskService
  ],
})
export class AppModule {}
