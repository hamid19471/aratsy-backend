import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerConfig(app: INestApplication) {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Arasty Blog API')
    .setDescription('API documentation for the project')
    .setVersion('1.0')
    .addServer(`http://localhost:${process.env.APP_PORT}`)
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('swagger', app, document);
}
