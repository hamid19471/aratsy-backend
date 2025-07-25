import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function dbConfig(): TypeOrmModuleOptions {
  const { DB_PORT, DB_NAME, DB_HOST, DB_PASSWORD, DB_USERNAME } = process.env;
  return {
    type: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    autoLoadEntities: true,
    synchronize: true,
    entities: ['dist/**/*.entity.{js,ts}', 'dist/**/**/**/*.entity.{js,ts}'],
  };
}
