import { Injectable } from "@nestjs/common";
import { TypeOrmOptionsFactory, TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

@Injectable()
export class DatabaseConnectionsService implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            name: 'default',
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: +process.env.DATABASE_PORT,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DB,
            synchronize: true,
            dropSchema: false,
            logging: true,
            entities: ['dist/**/*.entity.js']
        };
    }
} 