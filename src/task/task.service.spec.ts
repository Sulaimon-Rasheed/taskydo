import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Request, Response } from 'express';
import { User } from 'src/models/user.model';
import { Task } from 'src/models/task.model';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { UserService } from 'src/user/user.service';
import { getModelToken } from '@nestjs/sequelize';

describe('TaskService', () => {
  let taskService: TaskService;
  let userModel:typeof User;
  let taskModel:typeof Task;
  let authService:AuthenticationService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        AuthenticationService,
        UserService,
        {
          provide: getModelToken(Task),
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },

        {
          provide: getModelToken(Task),
          useValue: {
            findAndCountAll: jest.fn(),
          },
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    authService = module.get<AuthenticationService>(AuthenticationService);
    userModel = module.get<typeof User>(getModelToken(User));
    taskModel = module.get<typeof Task>(getModelToken(Task));
    
  });

//================TEST SUITE FOR CRAETING TASK========================
  describe("Task creation", ()=>{
    //==============Test case for successful task creation===========
    it("should create task successfully", async()=>{
      const createTaskDto:CreateTaskDto = {
        title:"Reading",
        description:"I want to read 10 pages of a book",
        due_date:"2024-10-06T2:00:00:00Z",
      }

      const req:Partial<Request> = {}
      const res:Partial<Response> = {
        locals: {
          user: {
            id: 1,
          },
        },
        status:jest.fn().mockReturnThis(),
        json:jest.fn().mockReturnThis()
      }

      jest.spyOn(authService, 'ensureLogin').mockImplementation(() => Promise.resolve());
      jest.spyOn(taskModel, 'create').mockResolvedValue({
        _id: 1,
        ...createTaskDto,
        status: 'Pending',
        user_id: 1,
      } as any);
      jest.spyOn(userModel, 'findOne').mockResolvedValue({
        _id: 1,
        taskIds: JSON.stringify([]),
        save: jest.fn(),
      } as any);

      await taskService.createTask(createTaskDto, req as Request, res as Response);

      expect(authService.ensureLogin).toHaveBeenCalledWith(req, res);
      expect(taskModel.create).toHaveBeenCalledWith({
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: 'Pending',
        due_date: createTaskDto.due_date,
        user_id: res.locals.user.id,
      });
      expect(userModel.findOne).toHaveBeenCalledWith({ where: { _id: res.locals.user.id } });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 201,
        message: 'Task created successfully',
      });


      //=================Test case to handle general errors=================
      it('should handle errors', async () => {
        const createTaskDto:CreateTaskDto = {
          title: 'New Task',
          description: 'Task description',
          due_date:"2024-10-06T2:00:00:00Z",
        };
  
        const req: Partial<Request> = {};
        const res: Partial<Response> = {
          locals: {
            user: {
              id: 1,
            },
          },
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        };
  
        const error = new Error('Approriate error');
        jest.spyOn(authService, 'ensureLogin').mockRejectedValue(error);
  
        await taskService.createTask(createTaskDto, req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          statusCode: 500,
          message: 'Approriate error',
        });
      });
    })
  })


  //==================TEST SUITE FOR RETREIVING ALL TASKS====================

  describe('retrieveMyTasks', () => {
    it('should retrieve tasks for the user successfully', async () => {
      const page = 1;
      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        locals: {
          user: {
            id: 1,
          },
        },
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      jest.spyOn(authService, 'ensureLogin').mockImplementation(() => Promise.resolve());
      jest.spyOn(taskModel, 'findAndCountAll').mockResolvedValue({
        rows: [
          {
            _id: 1,
            title: 'Task 1',
            description: 'Description 1',
            createdAt: new Date(),
            due_date: new Date(),
            status: 'Pending',
            user_id: 1,
          },
          {
            _id: 2,
            title: 'Task 2',
            description: 'Description 2',
            createdAt: new Date(),
            due_date: new Date(),
            status: 'Completed',
            user_id: 1,
          },
        ],
        count: 2,
      });

      await taskService.retrieveMyTasks(page, req as Request, res as Response);

      expect(authService.ensureLogin).toHaveBeenCalledWith(req, res);
      expect(taskModel.findAndCountAll).toHaveBeenCalledWith({
        where: { user_id: res.locals.user.id },
        offset: 0,
        limit: 2,
        order: [['createdAt', 'DESC']],
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: 'Below are your created tasks',
        page: 1,
        tasks_count: '2 of 2',
        result: [
          {
            title: 'Task 1',
            description: 'Description 1',
            created_time: expect.any(Date),
            due_date: expect.any(Date),
            status: 'Pending',
            update_task_to_completed: 'http://localhost:7500/v1/task/markTaskCompleted/1',
            delete_task: 'http://localhost:7500/v1/task/deleteOneTask/1',
          },
          {
            title: 'Task 2',
            description: 'Description 2',
            created_time: expect.any(Date),
            due_date: expect.any(Date),
            status: 'Completed',
            return_task_to_pending: 'http://localhost:7500/v1/task/markTaskPending/2',
            delete_task: 'http://localhost:7500/v1/task/deleteOneTask/2',
          },
        ],
      });
    });

    it('should handle errors', async () => {
      const page = 1;
      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        locals: {
          user: {
            id: 1,
          },
        },
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const error = new Error('Some error');
      jest.spyOn(authService, 'ensureLogin').mockRejectedValue(error);

      await taskService.retrieveMyTasks(page, req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Some error',
      });
    });

    it('should return 404 if no tasks are found', async () => {
      const page = 1;
      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        locals: {
          user: {
            id: 1,
          },
        },
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      jest.spyOn(authService, 'ensureLogin').mockImplementation(() => Promise.resolve());
      jest.spyOn(taskModel, 'findAndCountAll').mockResolvedValue({
        rows: [],
        count: 0,
      });

      await taskService.retrieveMyTasks(page, req as Request, res as Response);

      expect(authService.ensureLogin).toHaveBeenCalledWith(req, res);
      expect(taskModel.findAndCountAll).toHaveBeenCalledWith({
        where: { user_id: res.locals.user.id },
        offset: 0,
        limit: 2,
        order: [['createdAt', 'DESC']],
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 404,
        message: "You don't have any task at the moment. Create one!!",
        result: [],
      });
    });

    it('should return 404 if the requested page is empty', async () => {
      const page = 2;
      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        locals: {
          user: {
            id: 1,
          },
        },
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      jest.spyOn(authService, 'ensureLogin').mockImplementation(() => Promise.resolve());
      jest.spyOn(taskModel, 'findAndCountAll').mockResolvedValue({
        rows: [],
        count: 1,
      });

      await taskService.retrieveMyTasks(page, req as Request, res as Response);

      expect(authService.ensureLogin).toHaveBeenCalledWith(req, res);
      expect(taskModel.findAndCountAll).toHaveBeenCalledWith({
        where: { user_id: res.locals.user.id },
        offset: 2,
        limit: 2,
        order: [['createdAt', 'DESC']],
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 404,
        page: 2,
        message: 'This page is empty',
        result: [],
      });
    });
  });

});
