import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from 'src/models/user.model';
import { User } from 'src/auth/user.decotaror';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) {
    }
    async findByUsername(username: string, user?: UserEntity) {
        return (await this.userRepo.findOne({
            where: { username },
            relations: ['followers']
        })).toProfile(user);
    }



    async fallowUser(@User() currentUser: UserEntity, username: string) {
        const user = await this.userRepo.findOne({ where: { username }, relations: ['followers'] });
        user.followers.push(currentUser);

        await user.save();
        return user.toProfile(currentUser);
    }
    async unfallowUser(@User() currentUser: UserEntity, username: string) {
        const user = await this.userRepo.findOne({ where: { username }, relations: ['followers'] });
        user.followers = user.followers.filter(follower => {
            return currentUser !== follower;
        });
        await user.save();
        return user.toProfile(currentUser);
    }
}
