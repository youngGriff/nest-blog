import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateCommentDTO } from '../models/comment.model';

@Injectable()
export class CommentService {
  constructor(@InjectRepository(CommentEntity) private commentRepo: Repository<CommentEntity>) {
  }

  findByArticleSlug(slug: string) {
    return this.commentRepo.find({
      where: { 'article.slug': slug },
      relations: ['article'],
    });
  }

  findById(id: string) {
    return this.commentRepo.findOne({ where: { id } });
  }

  async createComment(user: UserEntity, data: CreateCommentDTO) {
    const comment = this.commentRepo.create(data);
    comment.author = user;
    await comment.save();
    return await this.commentRepo.findOne({
      where: {
        body: data.body,
      },
    });
  }

  async deleteComments(user: UserEntity, id: number) {
    const comment = await this.commentRepo.findOne({ where: { id, 'author.id': user.id } });
    await comment.remove();
    return comment;
  }
}

