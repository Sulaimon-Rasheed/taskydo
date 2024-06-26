import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AppService {
  getHome(req:Request, res:Response): object {
    return res.status(200).json({
      statusCode:200,
      message:"Welcome to Taskydo. ...a leading to-do application that provides you with a seamless service to record and manage your daily tasks for productivity.",
      Instruction:`Read the full documentation on https://documenter.getpostman.com/view/28974381/2sA3XLEj2Q to get the endpoints details.`
    })
  }
}
