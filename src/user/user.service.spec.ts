import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

describe('UserService', () => {
  let userService: UserService;
  let userModel: any;
  let encrypting: any;
  let AuthService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,
        { provide: 'UserModel', useValue: userModel },
        {provide: 'Encrypting', useValue: encrypting},
        { provide: 'AuthService', useValue: AuthService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };
    encrypting = {
      encryptString: jest.fn(),
      validateEncrptedString: jest.fn(),
    };

    AuthService = {
      generateJwtToken: jest.fn(),
    };
  });

//========================TEST SUITE FOR USER CREATION===========================  
  describe("user creation", ()=>{

    //============Test case for a successful user creation==========
    it("should create a user successfully", async ()=>{
      const createUserDto: CreateUserDto = {
        userName: 'Sulaimon',
        email: 'sulaimon@gmail.com',
        password: 'raslami12345',
      };

      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      }; 

      userModel.findOne.mockResolvedValue(null);
      encrypting.encryptString.mockResolvedValue('hashedpassword');
      userModel.create.mockResolvedValue({});

      await userService.createUser(createUserDto, req as Request, res as Response);

      expect(userModel.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
      expect(encrypting.encryptString).toHaveBeenCalledWith(createUserDto.password);
      expect(userModel.create).toHaveBeenCalledWith({
        userName: createUserDto.userName,
        email: createUserDto.email,
        password: 'hashedpassword',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 201,
        message: 'Your account has been created successfully',
      });

    //================Test case for conflict error if user already exist=================     
      it('should give a conflict error if user already exists', async () => {
        const createUserDto: CreateUserDto = {
          userName: 'Sulaimon',
          email: 'sulaimon@gmail.com',
          password: 'raslami12345',
        };
  
        const req: Partial<Request> = {};
        const res: Partial<Response> = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        };
  
        userModel.findOne.mockResolvedValue({});
  
        await userService.createUser(createUserDto, req as Request, res as Response);
  
        expect(userModel.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
          statusCode: 409,
          message: 'User already exist',
        });
      });

    //=============Test case for general errors==================
      it('should handle errors', async () => {
        const createUserDto: CreateUserDto = {
          userName: 'Sulaimon',
          email: 'sulaimon@gmail.com',
          password: 'raslami12345',
        };
  
        const req: Partial<Request> = {};
        const res: Partial<Response> = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        };
  
        const error = new Error('Some error');
        userModel.findOne.mockRejectedValue(error);
  
        await userService.createUser(createUserDto, req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          statusCode: 500,
          message: 'Appropriate error',
        });
      });

    })
  })


//=======================TEST SUIT FOR USER LOGIN========================
  describe('user login', () => {

    //===========Test case for successful login===============
    it('should login a user', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'sulaimon@gmail.com',
        password: 'raslami1234',
      };

      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis(),
      };

      userModel.findOne.mockResolvedValue({
        _id: 1,
        email: 'sulaimon@gmail.com',
        userName: 'Sulaimon',
        password: 'kkfjf6588585m---->hashed password',
      });
      encrypting.validateEncrptedString.mockResolvedValue(true);
      AuthService.generateJwtToken.mockResolvedValue('sulaimontoken');

      await userService.loginUser(loginUserDto, req as Request, res as Response);

      expect(userModel.findOne).toHaveBeenCalledWith({ where: { email: loginUserDto.email } });
      expect(encrypting.validateEncrptedString).toHaveBeenCalledWith(loginUserDto.password, 'hashedpassword');
      expect(AuthService.generateJwtToken).toHaveBeenCalledWith(1, 'sulaimon@gmail.com', 'sulaimonuser');
      expect(res.cookie).toHaveBeenCalledWith('jwt', 'sulaimontoken', { maxAge: 2 * 60 * 60 * 1000 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 200,
        greeting: 'Welcome Sulaimon',
        message: 'You are successfully logged in',
      });
    });

    //==========Test case for user not found=================
    it('should return 404 if user not found', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'adeolu@gmail.com',
        password: 'adeolu123',
      };

      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      userModel.findOne.mockResolvedValue(null);

      await userService.loginUser(loginUserDto, req as Request, res as Response);

      expect(userModel.findOne).toHaveBeenCalledWith({ where: { email: loginUserDto.email } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 404,
        message: 'Opps!! User not found',
      });
    });


    //==============Test case for incorrect password=================
    it('should return 401 if password is incorrect', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'sulaimon@gmail.com',
        password: 'sulami123-->wrong password',
      };

      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      userModel.findOne.mockResolvedValue({
        _id: 1,
        email: 'sulaimon@gmail.com.com',
        userName: 'Sulaimon',
        password: 'jhfhf665885nngng-->hashed password',
      });
      encrypting.validateEncrptedString.mockResolvedValue(false);

      await userService.loginUser(loginUserDto, req as Request, res as Response);

      expect(userModel.findOne).toHaveBeenCalledWith({ where: { email: loginUserDto.email } });
      expect(encrypting.validateEncrptedString).toHaveBeenCalledWith(loginUserDto.password, 'hashedpassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 401,
        message: 'Opps!! email or password is incorrect.',
      });
    });

    //================Test case for internal error========================
    it('should handle errors', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'sulaimon@gmail.com',
        password: 'raslami1234',
      };

      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const error = new Error('Some error');
      userModel.findOne.mockRejectedValue(error);

      await userService.loginUser(loginUserDto, req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Appropriate error',
      });
    });

  });

//===================TEST SUITE FOR LOGGING OUT==================
  describe("Logging out user", ()=>{

    //=====Test case for successful logout
    it("should logout user", async()=>{
      // const req:Partial<Request> = {}
      const res:Partial<Response> = {
        clearCookie:jest.fn().mockReturnThis(),
        status:jest.fn().mockReturnThis(),
        json:jest.fn().mockReturnThis()
      }

      await userService.logOut(res as Response);

      expect(res.clearCookie).toHaveBeenCalledWith("jwt")
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: 'Successfull logout',
      })
    })

    //==========Test case to handle general error=========
    it('should handle errors', async () => {
      
      const res: Partial<Response> = {
        clearCookie: jest.fn().mockImplementation(() => {
          throw new Error('Some error');
        }),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await userService.logOut(res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Appropriate error',
      });
    });
  })

});
