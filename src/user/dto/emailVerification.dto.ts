import {IsNotEmpty} from "class-validator";
import {IsEmail} from "./custom-class-validator"

export class emailVerificationDto {
    @IsNotEmpty()
    @IsEmail({
        message:"email must be a valid email"
      })
    email:string   
}