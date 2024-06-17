import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Request, Response } from 'express';

@Controller('v1/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  //=================== ENDPOINT FOR CREATING A TASK =========================
  @Post('/createTask')
  createTask(
    @Body(new ValidationPipe()) createTaskDto: CreateTaskDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.taskService.createTask(createTaskDto, req, res);
  }

  //=======================ENDPOINT FOR RETREIVING ALL TASKS OF LOGGED IN USER======================
  @Get('/retrieveMyTasks')
  retrieveMyTasks(
    @Query('page') page: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.taskService.retrieveMyTasks(+page || 1, req, res);
  }

  //====================ENDPOINT FOR RETEREIVING A PARTICULAR TASK OF A LOGGED IN USER======================
  @Get('/retrieveOneTask/:id')
  retrieveOneTask(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.taskService.retrieveOneTask(+id, req, res);
  }

  //============= ENDPOINT FOR UPDATING A PARTICULAR TASK OF A LOGGED IN USER==================
  @Post('/updateOneTask/:id')
  updateOneTask(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.taskService.updateOneTask(+id, updateTaskDto, req, res);
  }

  //=================== ENDPOINT FOR UPDATING TASK STATUS TO "COMPLETED" ======================
  @Post('/markTaskCompleted/:id')
  markTaskCompleted(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.taskService.markTaskCompleted(+id, req, res);
  }

  //======================= ENDPOINT FOR RETURNING A TASK STATUS TO "PENDING" ======================
  @Post('/markTaskPending/:id')
  returnTaskToPending(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.taskService.returnTaskToPending(+id, req, res);
  }

  //======================= ENDPOINT FOR FILTERING TASKS BY "STATUS" ======================
  @Get('/filterTaskByStatus')
  filterTaskByStatus(
    @Query('status') status: string,
    @Query('page') page: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.taskService.filterTaskByStatus(status, +page || 1, req, res);
  }

  //======================= ENDPOINT FOR DELETING A TASK ======================
  @Post('/deleteOneTask/:id')
  deleteOneTask(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.taskService.deleteOneTask(+id, req, res);
  }
}
