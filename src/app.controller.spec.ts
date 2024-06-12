import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Request, Response} from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import * as request from 'supertest';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockRequest = {} as Request;
  const mockResponse = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([{
          ttl: 60,
          limit: 10,
        }]),
      ],
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: { getHome: jest.fn().mockReturnValue({ message: 'Welcome Home' }) },
        },
        Reflector,
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should return expected result from getHome', () => {
    appController.getHome(mockRequest, mockResponse);

    expect(appService.getHome).toHaveBeenCalledWith(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Welcome Home' });
  });
});