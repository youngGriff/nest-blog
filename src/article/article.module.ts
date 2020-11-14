import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { UserEntity } from '../entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity]), AuthModule],
  providers: [ArticleService, CommentService],
  controllers: [ArticleController]
})
export class ArticleModule {}
