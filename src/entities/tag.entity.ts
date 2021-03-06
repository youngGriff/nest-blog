import { AbstractEntity } from './abstract.entity';
import { Column, Entity } from 'typeorm';
import { classToPlain } from 'class-transformer';

@Entity('tags')
export class TagEntity extends AbstractEntity {
  @Column()
  tag: string;

  toJson() {
    return classToPlain(this);
  }
}