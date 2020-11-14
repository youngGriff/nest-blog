import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Like, Repository } from 'typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { CreateArticleDTO, FindAllQuery, FindFeedQuery, UpdateArticleDTO } from '../models/article.model';

@Injectable()
export class ArticleService {
  constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
              @InjectRepository(ArticleEntity) private articleRepo: Repository<ArticleEntity>) {
  }

  async findAll(user: UserEntity, query: FindAllQuery) {
    const findOptions: any = {
      where: {},
    };
    if (query.author) {
      findOptions.where['author.username'] = query.author;
    }
    if (query.favorited) {
      findOptions.where['favoritedBy.username'] = query.favorited;
    }
    if (query.tag) {
      findOptions.where['tagList'] = Like(`${query.tag}`);
    }
    if (query.limit) {
      findOptions.take = Number(query.limit);
    }
    if (query.offset) {
      findOptions.skip = Number(query.offset);
    }
    console.log(findOptions);
    return (await this.articleRepo.find(findOptions)).map(article => article.toArticle(user));
  }

  async findFeed(user: UserEntity, query: FindFeedQuery) {
    const { followee } = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['followee'],
    });
    const findOptions = { ...query, where: followee.map(item => ({ author: item.id })) };
    return (await this.articleRepo.find(findOptions)).map(article => article.toArticle(user));
  }

  findBySlug(slug: string) {
    return this.articleRepo.findOne({ where: { slug } });
  }

  private ensureOwnership(user: UserEntity, article: ArticleEntity): boolean {
    return article.author.id === user.id;
  }

  async createArticle(user: UserEntity, data: CreateArticleDTO) {
    const article = this.articleRepo.create(data);
    article.author = user;
    const { slug } = await article.save();

    return (await this.articleRepo.findOne({ where: { slug } })).toArticle(user);
  }

  async updateArticle(slug: string, user: UserEntity, data: UpdateArticleDTO) {
    const article = await this.findBySlug(slug);
    if (!this.ensureOwnership(user, article)) {
      throw new UnauthorizedException();
    }
    await this.articleRepo.update({ slug }, data);
    return article.toArticle(user);
  }

  async deleteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    if (!this.ensureOwnership(user, article)) {
      throw new UnauthorizedException();
    }
    await this.articleRepo.delete({ slug });
  }

  async favorite(slug, user: UserEntity) {
    const article = await this.findBySlug(slug);
    article.favoritedBy.push(user);
    await article.save();
    return (await this.findBySlug(slug)).toArticle(user);
  }
  async unfavorite(slug, user: UserEntity) {
    const article = await this.findBySlug(slug);
    article.favoritedBy = article.favoritedBy.filter(item => item.id !== user.id);
    await article.save();
    return (await this.findBySlug(slug)).toArticle(user);
  }
}
