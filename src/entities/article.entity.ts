import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne, OneToMany,
  RelationCount,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import * as slugify from 'slug';
import { UserEntity } from './user.entity';
import { classToPlain } from "class-transformer";
import { CommentEntity } from './comment.entity';

@Entity('articles')
export class ArticleEntity extends AbstractEntity {


  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;
  @Column()
  slug: string;

  @ManyToOne(type => UserEntity, user => user.articles, {eager: true})
  author: UserEntity;

  @ManyToMany(type => UserEntity, user => user.favorites, {eager: true})
  @JoinTable()
  favoritedBy: UserEntity[];

  @OneToMany(type => CommentEntity, comment => comment.article)
  comments: CommentEntity[];

  @RelationCount((article: ArticleEntity) => article.favoritedBy)
  favoritesCount: number;

  @Column('simple-array')
  tagList: string[];

  @BeforeInsert()
  generateSlug() {
    this.slug =
      slugify(this.title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  toJson() {
    return classToPlain(this);
  }

  toArticle(user: UserEntity) {
    let favorited;
    if (user) {
      favorited = this.favoritedBy.map(user => user.id).includes(user.id);
    }
    const article = this.toJson();
    delete article.favoritedBy;
    return { ...article, favorited };
  }
}