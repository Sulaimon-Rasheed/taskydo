import {IsNotEmpty, IsString, Matches, MinLength} from 'class-validator';
import {IsEmail} from "./custom-class-validator"

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({
    message: 'userName is required',
  })
  @Matches(/^\S+$/, {
    message: 'userName must not contain any whitespace',
  })

  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'userName must contain only alphanumeric characters',
  })
  userName: string;

  @IsString()
  @IsNotEmpty({
    message: 'email is required',
  })
  @IsEmail({
    message:"email must be a valid email"
  })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'password is required',
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  password: string;
}
