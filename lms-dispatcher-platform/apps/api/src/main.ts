import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
  );

  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}/api/v1`);
}

bootstrap();
