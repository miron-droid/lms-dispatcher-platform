import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: ['https://dispatchgo.net', 'https://www.dispatchgo.net', 'http://localhost:3000', 'http://localhost:3200'], credentials: true, methods: ['GET','POST','PATCH','PUT','DELETE','OPTIONS'] } });

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
  app.getHttpAdapter().getInstance().disable("x-powered-by");

  // Graceful shutdown: close server on SIGINT/SIGTERM so PM2 restarts
  // don't hit EADDRINUSE when the old process still holds the port.
  app.enableShutdownHooks();

  await app.listen(port, '127.0.0.1');
  console.log(`API running on http://localhost:${port}/api/v1`);
}

bootstrap();
