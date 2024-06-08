import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { Task } from 'src/models/task.model';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as encrypting from '../utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Task) private readonly taskModel: typeof Task,
    private readonly AuthService: AuthenticationService,
  ) {}

  //======================= SERVICE FOR CREATING A USER ======================
  async createUser(
    createUserDto: CreateUserDto,
    req: Request,
    res: Response,
  ): Promise<Object> {
    try {
      const existingUser: any = await this.userModel.findOne({
        where: {
          email: createUserDto.email,
        },
      });
      if (existingUser) {
        throw new ConflictException('User already exist');
      }

      const hashedPassword = await encrypting.encryptString(
        createUserDto.password,
      );

      const user = await this.userModel.create({
        userName: createUserDto.userName,
        email: createUserDto.email,
        password: hashedPassword,
      });

      return res.status(201).json({
        statusCode: 201,
        message: 'Your account has been created successfully',
      });
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  //======================= SERVICE FOR LOGGING IN USER ======================
  async loginUser(loginUserDto: LoginUserDto, req: Request, res: Response) {
    try {
      const { email, password } = loginUserDto;
      let user = await this.userModel.findOne({ where: { email } });

      if (!user) {
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
        return res.json({
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

      return res.status(200).json({
        statusCode: 200,
        greeting: `Welcome ${user.userName}`,
        message: 'You are successfully logged in',
      });
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  //======================= SERVICE FOR LOGGING OUT USER ======================
  async logOut(req: Request, res: Response): Promise<Object> {
    try {
      res.clearCookie('jwt');
      return res.status(200).json({
        statusCode: 200,
        message: 'Successfull logout',
      });
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        message: err.message,
      });
    }
  }
}
