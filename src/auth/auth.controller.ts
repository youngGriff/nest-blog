import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto, LoginDto } from 'src/models/user.model';

@Controller('users')
export class AuthController {

    constructor(private authService: AuthService) {

    }

    @Post()
    register(@Body(ValidationPipe) credentials: RegistrationDto) {
        return this.authService.register(credentials);
    }

    @Post('/login')
    login(@Body(ValidationPipe) credentials: LoginDto) {
        return this.authService.login(credentials);

    }
}
