import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AppService {
  getHome(req:Request, res:Response): object {
    return res.status(200).json({
      statusCode:200,
      message:"Welcome to Fix"
    })
  }
}
