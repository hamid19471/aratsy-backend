import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './configs/db.config';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategorisModule } from './modules/categoris/categoris.module';
import { CacheModule } from './modules/cache/cache.module';
import { BlogModule } from './modules/blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),
    TypeOrmModule.forRoot(dbConfig()),
    UserModule,
    AuthModule,
    CategorisModule,
    CacheModule,
    BlogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
