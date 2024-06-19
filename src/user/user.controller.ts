import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  ValidationPipe,
  Param,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { emailVerificationDto } from './dto/emailVerification.dto';
import { newPasswordDto } from './dto/newPassword.dto';

@Controller('v1/user')
@UseGuards(ThrottlerGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  //======================= ENDPOINT FOR CREATING A USER ======================
  @Post('/signup')
  createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.userService.createUser(createUserDto, req, res);
  }

  //======================= ENDPOINT TO VERIFY USER'S EMAIL FOR PASSWORD RESET. ======================
  @Post('/verifyEmailForPasswordReset')
  async verifyEmailForPasswordReset(
    @Body(new ValidationPipe()) emailVerifyDto: emailVerificationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.userService.verifyEmailForPasswordReset(emailVerifyDto, req, res);
  }

  //======================= ENDPOINT TO VERIFY PASSWORD RESET LINK ======================
  @Get('/verifyPasswordResetLink/:resetToken/:email')
  verifyUserPasswordResetLink(
    @Param('resetToken') resetToken: string,
    @Param('email') email: string,
    @Res() res: Response,
  ) {
    this.userService.verifyUserPasswordResetLink(resetToken, email, res);
  }

  //======================= ENDPOINT TO SET A NEW PASSWORD ======================
  @Post('/newPassword/:userId')
  async setNewPassword(
    @Body(new ValidationPipe()) newPasswordDto: newPasswordDto,
    @Param('userId') userId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.userService.setNewPassword(newPasswordDto, userId, res);
  }

  //======================= ENDPOINT FOR LOGGING IN USER ======================
  @Post('/login')
  login(
    @Body(new ValidationPipe()) loginUserDto: LoginUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.userService.loginUser(loginUserDto, req, res);
  }

  //======================= ENDPOINT FOR LOGGING OUT USER ======================
  @Post('/logout')
  logOut(@Res() res: Response) {
    this.userService.logOut(res);
  }
}
