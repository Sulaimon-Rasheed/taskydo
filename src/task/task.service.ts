import { Injectable} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from 'src/models/task.model';
import { User } from 'src/models/user.model';
import { Request, Response } from 'express';

@Injectable()
export class TaskService {
  constructor(
    private readonly AuthService: AuthenticationService,
    @InjectModel(Task) private readonly taskModel: typeof Task,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  //=================== SERVICE FOR CREATING A TASK =========================
  async createTask(
    createTaskDto: CreateTaskDto,
    req: Request,
    res: Response,
  ): Promise<Object> {
    try {
      await this.AuthService.ensureLogin(req, res);

      const task = await this.taskModel.create({
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: 'Pending',
        due_date: createTaskDto.due_date,
        user_id: res.locals.user.id,
      });

      const user = await this.userModel.findOne({
        where: { _id: res.locals.user.id },
      });
      if (user) {
        const taskIds = user.taskIds ? JSON.parse(user.taskIds) : [];
        taskIds.push(task._id);
        user.taskIds = JSON.stringify(taskIds);
        await user.save();
      }

      return res.status(201).json({
        statusCode: 201,
        message: 'Task created successfully',
      });
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  //===============SERVICE FOR RETREIVING ALL TASKS OF A LOGGED IN USER------> (ORDERED AND PAGINATED)======================
  async retrieveMyTasks(
    page: number,
    req: Request,
    res: Response,
  ): Promise<Object> {
    try {
      await this.AuthService.ensureLogin(req, res);

      let limit = 2;
      let offset = (page - 1) * limit;
      const id = res.locals.user.id;
      const { rows: tasks, count: Alltasks } =
        await this.taskModel.findAndCountAll({
          where: { user_id: id },
          offset,
          limit,
          order: [['createdAt', 'DESC']],
        });

      if (Alltasks == 0) {
        return res.status(404).json({
          statusCode: 404,
          message: "You don't have any task at the moment. Create one!!",
          result: [],
        });
      }

      let ArrayOfTasks = [];
      let currUrl = 'https://taskydo-1.onrender.com/v1';
      let neededInfo;
      for (const task of tasks) {
        if (task.status === 'Pending') {
          neededInfo = {
            title: task.title,
            description: task.description,
            created_time: task.createdAt,
            due_date: task.due_date,
            status: task.status,
            update_task_to_completed: `${currUrl}/task/markTaskCompleted/${task._id}`,
            delete_task: `${currUrl}/task/deleteOneTask/${task._id}`,
          };
        } else {
          neededInfo = {
            title: task.title,
            description: task.description,
            created_time: task.createdAt,
            due_date: task.due_date,
            status: task.status,
            return_task_to_pending: `${currUrl}/task/markTaskPending/${task._id}`,
            delete_task: `${currUrl}/task/deleteOneTask/${task._id}`,
          };
        }

        ArrayOfTasks.push(neededInfo);
      }

      let totalPages = Math.ceil(Alltasks / limit);

      if (Alltasks == 1 && totalPages >= page) {
        return res.status(200).json({
          statusCode: 200,
          message: 'Below is your created task',
          current_page: page,
          tasks_count: `${tasks.length} of ${Alltasks}`,
          result: ArrayOfTasks,
        });
      } else if (Alltasks > 1 && totalPages >= page) {
        return res.status(200).json({
          statusCode: 200,
          message: 'Below are your created tasks',
          page: page,
          tasks_count: `${tasks.length} of ${Alltasks}`,
          result: ArrayOfTasks,
        });
      } else if (Alltasks >= 1 && totalPages < page) {
        return res.status(404).json({
          statusCode: 404,
          page: page,
          message: 'This page is empty',
          result: [],
        });
      }
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  //====================SERVICE FOR RETEREIVING A PARTICULAR TASK OF A LOGGED IN USER======================
  async retrieveOneTask(
    id: number,
    req: Request,
    res: Response,
  ): Promise<Object> {
    try {
      await this.AuthService.ensureLogin(req, res);

      const userId = res.locals.user.id;
      const taskId = id;
      let neededInfo;
      let currUrl = 'https://taskydo-1.onrender.com/v1';

      const task = await this.taskModel.findOne({
        where: { _id: taskId, user_id: userId },
      });

      if (!task) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Task not found',
        });
      }

      if (task.status === 'Pending') {
        neededInfo = {
          title: task.title,
          description: task.description,
          created_time: task.createdAt,
          due_date: task.due_date,
          status: task.status,
          update_task_to_completed: `${currUrl}/task/markTaskCompleted/${task._id}`,
          delete_task: `${currUrl}/task/deleteOneTask/${task._id}`,
        };
      } else {
        neededInfo = {
          title: task.title,
          description: task.description,
          created_time: task.createdAt,
          due_date: task.due_date,
          status: task.status,
          return_task_to_pending: `${currUrl}/task/markTaskPending/${task._id}`,
          delete_task: `${currUrl}/task/deleteOneTask/${task._id}`,
        };
      }

      return res.status(200).json({
        statusCode: 200,
        message: 'Below is the task',
        result: neededInfo,
      });
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  //============= SERVICE FOR UPDATING A PARTICULAR TASK OF A LOGGED IN USER==================
  async updateOneTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
    req: Request,
    res: Response,
  ): Promise<Object> {
    try {
      await this.AuthService.ensureLogin(req, res);

      const taskId = id;
      const userId = res.locals.user.id;

      let theTask = await this.taskModel.findOne({
        where: { _id: taskId, user_id: userId },
      });
      if (!theTask) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Task not found',
        });
      }

      await theTask.update(updateTaskDto);

      return res.status(200).json({
        statusCode: 200,
        message: 'Task updated successfully',
        result: theTask,
      });
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  //=================== SERVICE FOR UPDATING TASK STATUS TO "COMPLETED" ======================
  async markTaskCompleted(
    id: number,
    req: Request,
    res: Response,
  ): Promise<Object> {
    try {
      await this.AuthService.ensureLogin(req, res);
      const taskId = id;
      const userId = res.locals.user.id;

      let theTask = await this.taskModel.findOne({
        where: { _id: taskId, user_id: userId },
      });
      if (!theTask) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Task not found',
        });
      }

      theTask.status = 'Completed';
      theTask.save();

      return res.status(200).json({
        statusCode: 200,
        message: "Task status has been successfully updated to 'Completed'",
        result: theTask,
      });
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  //======================= SERVICE FOR RETURNING A TASK STATUS TO "PENDING" ======================
  async returnTaskToPending(
    id: number,
    req: Request,
    res: Response,
  ): Promise<Object> {
    try {
      await this.AuthService.ensureLogin(req, res);
      const taskId = id;
      const userId = res.locals.user.id;

      let theTask = await this.taskModel.findOne({
        where: { _id: taskId, user_id: userId },
      });
      if (!theTask) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Task not found',
        });
      }

      theTask.status = 'Pending';
      theTask.save();

      return res.status(200).json({
        statusCode: 200,
        message: "Task status has been successfully updated to 'Pending'",
        result: theTask,
      });
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  //===============SERVICE FOR RETURNING A TASK STATUS TO "PENDING"----> (ORDERED AND PAGINATED) ======================
  async filterTaskByStatus(
    status: string,
    page: number,
    req: Request,
    res: Response,
  ): Promise<Object> {
    try {
      await this.AuthService.ensureLogin(req, res);

      const userId = res.locals.user.id;
      let limit = 2;
      let offset = (page - 1) * limit;

      let ArrayOfTasks = [];
      let currUrl = 'https://taskydo-1.onrender.com/v1';
      let neededInfo;
      let totalPages;

      if (status !== 'Pending' && status !== 'Completed') {
        return res.status(406).json({
          statusCode: 406,
          message: `Opps!! Your query can not be processed. status can only be either "Pending" or "Completed" `,
        });
      }

      const { rows: tasks, count: Alltasks } =
        await this.taskModel.findAndCountAll({
          where: { status: status, user_id: userId },
          offset,
          limit,
          order: [['CreatedAt', 'DESC']],
        });

      if (Alltasks == 0) {
        return res.status(404).json({
          statusCode: 404,
          message: `You don't have ${status} task at the moment `,
          result: [],
        });
      }

      for (const task of tasks) {
        if (status === 'Pending') {
          neededInfo = {
            title: task.title,
            description: task.description,
            created_time: task.createdAt,
            due_date: task.due_date,
            status: task.status,
            update_task_to_completed: `${currUrl}/task/markTaskCompleted/${task._id}`,
            delete_task: `${currUrl}/task/deleteOneTask/${task._id}`,
          };
        } else if (status === 'Completed') {
          neededInfo = {
            title: task.title,
            description: task.description,
            created_time: task.createdAt,
            due_date: task.due_date,
            status: task.status,
            return_task_to_pending: `${currUrl}/task/markTaskPending/${task._id}`,
            delete_task: `${currUrl}/task/deleteOneTask/${task._id}`,
          };
        }

        ArrayOfTasks.push(neededInfo);
      }

      totalPages = Math.ceil(Alltasks / limit);

      if (Alltasks == 1 && totalPages >= page) {
        return res.status(200).json({
          statusCode: 200,
          message: `Below is your ${status} task`,
          current_page: page,
          tasks_count: `${tasks.length} of ${Alltasks}`,
          result: ArrayOfTasks,
        });
      } else if (Alltasks > 1 && totalPages >= page) {
        return res.status(200).json({
          statusCode: 200,
          message: `Below are your  ${status} tasks`,
          page: page,
          tasks_count: `${tasks.length} of ${Alltasks}`,
          result: ArrayOfTasks,
        });
      } else if (Alltasks >= 1 && totalPages < page) {
        return res.status(404).json({
          statusCode: 404,
          page: page,
          message: 'This page is empty',
          result: [],
        });
      }
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  //======================= SERVICE FOR DELETING A TASK ======================
  async deleteOneTask(
    id: number,
    req: Request,
    res: Response,
  ): Promise<Object> {
    try {
      await this.AuthService.ensureLogin(req, res);
      const taskId = id;
      const userId = res.locals.user.id;

      const theTask = await this.taskModel.findOne({
        where: { _id: taskId, user_id: userId },
      });
      if (!theTask) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Task not found',
        });
      }

      await theTask.destroy();

      return res.status(200).json({
        statusCode: 200,
        message: 'Task deleted successfully',
      });
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err.message,
      });
    }
  }
}
