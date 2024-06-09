import { IsNotEmpty, IsString, MinLength, min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({
    message: 'userName is required',
  })
  userName: string;

  @IsString()
  @IsNotEmpty({
    message: 'email is required',
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
