import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('v1/user')
@UseGuards(ThrottlerGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  //======================= ENDPOINT FOR CREATING A USER ======================
  @Post('/signup')
  async createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.userService.createUser(createUserDto, req, res);
  }

  //======================= ENDPOINT FOR LOGGING IN USER ======================
  @Post('/login')
  async login(
    @Body(new ValidationPipe()) loginUserDto: LoginUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.userService.loginUser(loginUserDto, req, res);
  }

  //======================= ENDPOINT FOR LOGGING OUT USER ======================
  @Post('/logout')
  async logOut(@Res() res: Response) {
    await this.userService.logOut(res);
  }
}
