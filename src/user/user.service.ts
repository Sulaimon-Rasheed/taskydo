import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as encrypting from '../utils/bcrypt';
import { WinstonLoggerService } from 'src/logger/logger.service';
import { emailVerificationDto } from './dto/emailVerification.dto';
import { v4 as uuidv4 } from 'uuid';
import * as mailService from '../utils/mailer';
import { newPasswordDto } from './dto/newPassword.dto';
import { DataType, Sequelize } from 'sequelize-typescript';
import { DATE } from 'sequelize';

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

  //================VERIFYING USER'S EMAIL FOR PASSWORD RESET.=================================
  async verifyEmailForPasswordReset(
    emailVerifyDto: emailVerificationDto,
    req: Request,
    res: Response,
  ) {
    try {
      const user: User = await this.userModel.findOne({
        where: {
          email: emailVerifyDto.email,
        },
      });
      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Opps!! User not found',
        });
      }

      const resetToken = uuidv4();
      const hashedResetToken = await encrypting.encryptString(resetToken);
      user.passwordResetLink = hashedResetToken;
      user.passwordResetLinkExpiringDate = new Date(
        Date.now() + 10 * 60 * 1000,
      );
      user.save();

      const currUrl = 'https://taskydo.onrender.com/v1';

      mailService.sendEmail({
        email: user.email,
        subject: 'We received your request for password reset',
        html: `<div style = "background-color:lightgrey; padding:16px"; border-radius:20px>
        <p>Hi, ${user.userName}</P>
        <p>Click the link below to reset your paasword.</P>
        <p><a href= ${currUrl + '/user/verifyPasswordResetLink/' + resetToken + '/' + user.email}>
        ${currUrl + '/user/verifyPasswordResetLink/' + resetToken + '/' + user.email}
        </a>
        </P>
        <p>This link <b>will expire in the next 10min</b></P>
        </div>`,
      });
      
      return res.status(200).json({
        statusCode:200,
        message:'Successful password reset request. check your email for verification link',
      });
    } catch (err) {
      this.loggerService.error('Something broke', err.stack);
      return res.status(500).json({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  //=========================VERIFYING PASSWORD RESET LINK=================================
  async verifyUserPasswordResetLink(
    resetToken: string,
    email: string,
    res: Response,
  ) {
    try {
      const user = await this.userModel.findOne({ where: { email: email } });
      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Opps!! User not found',
        });
      }

      if (user.passwordResetLinkExpiringDate.getTime() < Date.now()) {
        return res.status(410).json({
          statusCode: 410,
          message: 'Opps!! Reset link has expired',
        });
      }

      const valid = await encrypting.validateEncrptedString(
        resetToken,
        user.passwordResetLink,
      );
      if (!valid) {
        return res.status(498).json({
          statusCode: 498,
          message: 'Opps!! Invalid reset link',
        });
      }

      user.passwordResetLink = "";
      user.passwordResetLinkExpiringDate = new Date();
      user.save();

      const currUrl = 'https://taskydo.onrender.com/v1';

      return res.status(200).json({
        statusCode: 200,
        message: 'Successful verification',
        passwordResetUrl: `${currUrl}/user/newPassword/${user._id}`,
      });
    } catch (err) {
      this.loggerService.error('Something broke', err.stack);
      return res.status(500).json({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  //==================SETTING A NEW PASSWORD===============================
  async setNewPassword(
    newPasswordDto: newPasswordDto,
    userId: string,
    res: Response,
  ) {
    const user = await this.userModel.findOne({ where: { _id: userId } });
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: `Opps!! User not found`,
      });
    }

    const newPassword = newPasswordDto.newPassword;
    const hashedPassword = await encrypting.encryptString(newPassword);
    user.password = hashedPassword;
    user.save();
    return res.status(200).json({
      statusCode: 200,
      message:
        'Successful password reset. You can now login with your new password.',
    });
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
