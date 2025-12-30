import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // ✅ FIX: Listen port 3000 (internal) + bind 0.0.0.0 cho Docker
  await app.listen(3000, '0.0.0.0');

  console.log('🚀 Docx API running on http://0.0.0.0:3000');
}
bootstrap();
