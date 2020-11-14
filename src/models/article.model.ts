import { IsArray, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreateArticleDTO {
  @IsString()
  title: string;
  @IsString()
  body: string;
  @IsString()
  description: string;
  @IsArray()
  @IsString({ each: true })
  tagList: string[];
}

export class UpdateArticleDTO {
  @IsString()
  @Optional()
  title: string;

  @IsString()
  @Optional()
  body: string;

  @IsString()
  @Optional()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @Optional()
  tagList: string[];
}

export class FindAllQuery {
  @Optional()
  limit?: number;
  @Optional()
  offset?: number;
  tag?: string;
  author?: string;
  favorited?: string;
}

export class FindFeedQuery extends FindAllQuery {

}