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

@Module({
  imports: [
    DatabaseModule,
    ThrottlerModule.forRoot([{ ttl: 60 * 1000, limit: 3 }]),
    UserModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    AuthenticationService,
  ],
})
export class AppModule {}
