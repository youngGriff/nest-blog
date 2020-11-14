import { Injectable, InternalServerErrorException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { RegistrationDto, LoginDto, UpdateUserDTO } from 'src/models/user.model';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        private jwtService: JwtService) {
    }

    async register(credintials: RegistrationDto) {
        try {
            const user = this.userRepo.create(credintials);
            await user.save();
            const authPayload = { username: user.username };
            const token = this.jwtService.sign(authPayload, { secret: process.env.SECRET });

            return { user: { ...user.toJson(), token } };
        }
        catch (err) {
            if (err.code === '23505')
                throw new ConflictException('Username is already taken')

            console.log(err);
            throw new InternalServerErrorException()
        }
    }

    async login(credintials: LoginDto) {
        const { email, password } = credintials;
        try {
            const user = await this.userRepo.findOne({
                where: { email }
            });
            const isValid = await user.comparePassword(password);
            if (!isValid) {
                throw new UnauthorizedException('Invalid credentials')
            }
            const authPayload = { username: user.username };
            const token = this.jwtService.sign(authPayload, { secret: process.env.SECRET });

            return { user: { ...user.toJson(), token } };
        }
        catch (err) {
            console.log(err);
            throw new UnauthorizedException('Invalid credentials');
        }
    }
    async findCurrentUser(username: string) {
        const user =  await this.userRepo.findOne({where: {username}})
        const authPayload = { username };
        const token = this.jwtService.sign(authPayload, { secret: process.env.SECRET });
        return { ...user.toJson(),  token};
    }

    async updateUser(username: string, data: UpdateUserDTO) {
        await this.userRepo.update({ username }, data);
        return this.findCurrentUser(username);
    }
}
