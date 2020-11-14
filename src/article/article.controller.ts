import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.decotaror';
import { UserEntity } from '../entities/user.entity';
import { CreateArticleDTO, FindFeedQuery, UpdateArticleDTO } from '../models/article.model';
import { OptiomalAuthGuard } from '../auth/optional-auth-guard';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from '../models/comment.model';

@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService, private commentService: CommentService) {
  }

  @Get()
  @UseGuards(new OptiomalAuthGuard())
  async findAll(@User() user: UserEntity, @Query() query: FindFeedQuery) {
    const articles = await this.articleService.findAll(user, query);
    return { articles, articleCount: articles.length };
  }

  @Get('/feed')
  @UseGuards(AuthGuard())
  async findFeed(@User() user: UserEntity, @Query() query: FindFeedQuery) {
    const articles = await this.articleService.findFeed(user, query);
    return { articles, articleCount: articles.length };

  }

  @Get(':/slug')
  @UseGuards(new OptiomalAuthGuard())
  async findBySlug(@Param('slug') slug: string, @User() user: UserEntity) {
    return (await this.articleService.findBySlug(slug)).toArticle(user);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createArticle(@User() user: UserEntity, @Body(ValidationPipe) data: CreateArticleDTO) {
    const article = await this.articleService.createArticle(user, data);
    return article;
  }

  @Put(':/slug')
  @UseGuards(AuthGuard())
  async updateArticle(@User() user: UserEntity, @Param('slug') slug: string, @Body(ValidationPipe) data: UpdateArticleDTO) {
    const article = await this.articleService.updateArticle(slug, user, data);
    return article;
  }

  @Delete(':/slug')
  @UseGuards(AuthGuard())
  async deleteArticle(@User() user: UserEntity, @Param('slug') slug: string) {
    const article = await this.articleService.deleteArticle(slug, user);
    return article;
  }

  @Get('/:slug/comments')
  async fetchComments(@User() user: UserEntity, @Param('slug') slug: string) {
    const comments = await this.commentService.findByArticleSlug(slug);
    return comments.map(item => item.toJson());
  }

  @Post('/:slug/comments')
  async createComment(@User() user: UserEntity, @Body(ValidationPipe) data: CreateCommentDTO) {
    const comment = await this.commentService.createComment(user, data);
    return comment.toJson();
  }

  @Delete('/:slug/comments/:id')
  async deleteComment(@User() user: UserEntity, @Param('id') id: number) {
    const comment = await this.commentService.deleteComments(user, id);
    return comment;
  }

  @Post('/:slug/favorite')
  @UseGuards(AuthGuard())
  async favoriteArticle(@User() user: UserEntity, @Param('slug') slug: string) {
    return this.articleService.favorite(slug, user);
  }

  @Delete('/:slug/favorite')
  @UseGuards(AuthGuard())
  async unfavoriteArticle(@User() user: UserEntity, @Param('slug') slug: string) {
    return this.articleService.unfavorite(slug, user);
  }

}
