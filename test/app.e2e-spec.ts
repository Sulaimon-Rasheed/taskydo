import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { Request, Response } from 'express';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
  });

  it('/ (GET)', () => {
    const req: Partial<Request> = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      }; 

      appController.getHome(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        statusCode:200,
        message:"Welcome to Taskydo. ...a leading to-do application that provides you with a seamless service to record and manage your daily tasks for productivity.",
        Instruction:`Read the documentation on https://documenter.getpostman.com/view/28974381/2sA3XLEj2Q for a better experience making request to the application`
      });
   
   
      // return request(app.getHttpServer())
    //   .get('/v1')
    //   .expect(200)
    //   .expect('Hello World!');
  });
});
