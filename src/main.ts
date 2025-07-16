import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.APP_PORT;
  swaggerConfig(app);
  await app.listen(PORT, () => {
    console.log(`server is running on port http://localhost:${PORT}`);
    console.log(`swagger is running on port http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
