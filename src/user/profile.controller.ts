import { Controller, Get, Post, Param, Delete, NotFoundException, UseGuards, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/auth/user.decotaror';
import { AuthGuard } from '@nestjs/passport';
import { OptiomalAuthGuard } from 'src/auth/optional-auth-guard';
import { UserEntity } from 'src/entities/user.entity';

@Controller('profiles')
export class ProfileController {
    constructor(private userService: UserService) {

    }
    @Get('/:username')
    @UseGuards(new OptiomalAuthGuard())
    async findProfile(@Param('username') username: string, @User() user: UserEntity) {
        const profile = await this.userService.findByUsername(username, user);
        if (!profile)
            throw new NotFoundException('User not found', username + ' is not found');

        return profile;
    }

    @Post('/:username/follow')
    @HttpCode(200)
    @UseGuards(AuthGuard())
    async followUser(@User() user, @Param('username') username: string) {
        const profile = await this.userService.fallowUser(user, username);
        return profile
    }

    @Delete('/:username/unfollow')
    @UseGuards(AuthGuard())
    async unfollowUser(@User() user, @Param('username') username: string) {
        const profile = await this.userService.unfallowUser(user, username);
        return profile;
    }
}
