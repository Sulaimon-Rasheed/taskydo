import { IsNotEmpty, IsString } from 'class-validator';
import {IsEmail} from "./custom-class-validator"

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail({
    message:"email must be a valid email"
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
