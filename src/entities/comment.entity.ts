import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';
import { classToPlain } from 'class-transformer';
import { ArticleEntity } from './article.entity';

@Entity('comments')
export class CommentEntity extends AbstractEntity {
  @Column()
  body: string;

  @ManyToOne(type => UserEntity, user => user.comments, { eager: true })
  author: UserEntity;

  @ManyToOne(type => ArticleEntity, article => article.comments)
  article: ArticleEntity;

  toJson() {
    return classToPlain(this);
  }
}