import { AbstractEntity } from "./abstract.entity";
import { Entity, Column, BeforeInsert, JoinTable, ManyToMany, OneToMany, JoinColumn, RelationCount } from 'typeorm';
import { Exclude, classToPlain } from "class-transformer";
import { IsEmail } from "class-validator";
import * as bscrypt from 'bcryptjs';
import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comment.entity';

@Entity('users')
export class UserEntity extends AbstractEntity {
    @Column()
    @IsEmail()
    email: string;

    @Column({ unique: true })
    username: string;

    @Column({ default: '' })
    bio: string;

    @Column({ default: null, nullable: true })
    image: string | null;

    @Column()
    @Exclude()
    password: string;

    @ManyToMany(type => UserEntity, user => user.followee)
    @JoinTable()
    followers: UserEntity[];

    @OneToMany(type => CommentEntity, comment => comment.author)
    comments: CommentEntity[];

    @OneToMany(type => ArticleEntity, article => article.author)
    articles: ArticleEntity[];

    @ManyToMany(type => ArticleEntity, article => article.favoritedBy)
    @JoinColumn()
    favorites: ArticleEntity[];



    // @JoinTable()
    @ManyToMany(type => UserEntity, user => user.followers)
    followee;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bscrypt.hash(this.password, 10)
    }
    async comparePassword(attemptPassword: string) {
        return await bscrypt.compare(attemptPassword, this.password);
    }

    toJson() {
        return classToPlain(this);
    }

    toProfile(user?: UserEntity) {
        let following;
        if (user) {
            following = this.followers.includes(user);
        }
        const profile = this.toJson();
        delete profile.followers;
        return { ...profile, following };
    }
}