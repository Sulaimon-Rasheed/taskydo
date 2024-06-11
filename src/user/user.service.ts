import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as encrypting from '../utils/bcrypt';
import { WinstonLoggerService } from 'src/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly AuthService: AuthenticationService,
    private readonly loggerService: WinstonLoggerService,
  ) {}

  //======================= SERVICE FOR CREATING A USER ======================
  async createUser(
    createUserDto: CreateUserDto,
    req: Request,
    res: Response,
  ): Promise<Object> {
    try {
      this.loggerService.log('Craeting a User......');

      const existingUser: any = await this.userModel.findOne({
        where: {
          email: createUserDto.email,
        },
      });
      if (existingUser) {
        this.loggerService.log('User already exist');

        return res.status(409).json({
          statusCode: 409,
          message: 'User already exist',
        });
      }

      const hashedPassword = await encrypting.encryptString(
        createUserDto.password,
      );

      const user = await this.userModel.create({
        userName: createUserDto.userName,
        email: createUserDto.email,
        password: hashedPassword,
      });

      this.loggerService.log(
        `User account created successful. userName:${user.userName}, id:${user._id}`,
      );

      return res.status(201).json({
        statusCode: 201,
        message: 'Your account has been created successfully',
      });
    } catch (err) {
      this.loggerService.error('Something broke', err.stack);
      return res.status(500).json({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  //======================= SERVICE FOR LOGGING IN USER ======================
  async loginUser(loginUserDto: LoginUserDto, req: Request, res: Response) {
    try {
      this.loggerService.log('Logging in a User...');
      const { email, password } = loginUserDto;
      let user = await this.userModel.findOne({ where: { email } });

      if (!user) {
        this.loggerService.log('User not found');
        return res.status(404).json({
          statusCode: 404,
          message: `Opps!! User not found`,
        });
      }

      const valid = await encrypting.validateEncrptedString(
        password,
        user.password,
      );

      if (!valid) {
        this.loggerService.log('email or password is incorrect.');
        return res.status(401).json({
          statusCode: 401,
          message: `Opps!! email or password is incorrect.`,
        });
      }

      const token: string = await this.AuthService.generateJwtToken(
        user._id,
        user.email,
        user.userName,
      );

      res.cookie('jwt', token, { maxAge: 2 * 60 * 60 * 1000 });

      this.loggerService.log(
        `Successful login by ${user.userName}, id:${user._id}`,
      );

      return res.status(200).json({
        statusCode: 200,
        greeting: `Welcome ${user.userName}`,
        message: 'You are successfully logged in',
      });
    } catch (err) {
      this.loggerService.error('Something broke', err.stack);
      return res.status(500).json({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  //======================= SERVICE FOR LOGGING OUT USER ======================
  async logOut(res: Response): Promise<Object> {
    try {
      this.loggerService.log('Logging out user...');

      res.clearCookie('jwt');

      this.loggerService.log('User logged out');

      return res.status(200).json({
        statusCode: 200,
        message: 'Successfull logout',
      });
    } catch (err) {
      this.loggerService.error('Something broke', err.stack);
      return res.status(500).json({
        statusCode: 500,
        message: err.message,
      });
    }
  }
}
