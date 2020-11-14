import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionsService } from './database-connection.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { TagEntity } from './entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    useClass: DatabaseConnectionsService,
  }), AuthModule,
    TypeOrmModule.forFeature([TagEntity]),
    UserModule, ArticleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}