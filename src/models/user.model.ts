import { IsEmail, MaxLength, IsString, MinLength, IsOptional, } from 'class-validator';

export class LoginDto {
    @IsEmail()
    @MinLength(4)
    email: string;

    @IsString()
    @MinLength(4)
    password: string;
}

export class RegistrationDto extends LoginDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;
}
export class UpdateUserDTO {
    @IsEmail()
    @IsOptional()
    email: string;
    @IsOptional()
    image;
    @IsOptional()
    bio;
}
export interface AuthPayload {
    username: string;
}