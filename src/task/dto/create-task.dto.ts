import { IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\S+$/, {
    message: 'userName must not contain any whitespace',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\S+$/, {
    message: 'userName must not contain any whitespace',
  })
  description: string;

  @IsDateString()
  @IsNotEmpty()
  @Matches(/^\S+$/, {
    message: 'userName must not contain any whitespace',
  })
  due_date: string;
}
