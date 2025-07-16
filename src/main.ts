import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './configs/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  swaggerConfig(app);
  const PORT = process.env.APP_PORT;
  await app.listen(PORT, () => {
    console.log(`server is running on port http://localhost:${PORT}`);
    console.log(`swagger is running on port http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
