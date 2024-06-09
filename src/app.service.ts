import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AppService {
  getHome(req:Request, res:Response): object {
    return res.status(200).json({
      statusCode:200,
      message:"Welcome to Taxydo. ...a leading to-do application that provides you with a seamless service to record and manage your daily tasks for productivity.",
      Instruction:`Read the documentation on https://taxydo.onrender.com/v1 for a better experience`
    })
  }
}
