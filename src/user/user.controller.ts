import { Controller, Get, UseGuards, Put, Body, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/auth/user.decotaror';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO } from 'src/models/user.model';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService, private authService: AuthService) { }

    @Get()
    @UseGuards(AuthGuard())
    async findCurrentUser(@User() { username }: UserEntity) {
        return await this.authService.findCurrentUser(username);
    }

    @Put()
    @UseGuards(AuthGuard())
    update(@User() { username }: UserEntity, @Body(new ValidationPipe({ whitelist: true, transform: true })) data: UpdateUserDTO) {
        return this.authService.updateUser(username, data);
    }
}
