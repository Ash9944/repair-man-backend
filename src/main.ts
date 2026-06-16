import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './configs/config.types';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<AllConfigType>);

  // CORS — restrict to configured origins in production
  const allowedOrigins = process.env.ALLOWED_ORIGINS;
  const origins: string | string[] = allowedOrigins
    ? allowedOrigins.split(',').map((o) => o.trim())
    : '*';
  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // API prefix (e.g. /api/*)
  const apiPrefix = configService.get<string>('app.apiPrefix' as any) ?? 'api';
  app.setGlobalPrefix(apiPrefix);

  // Body parser limits for file uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(express.raw({ limit: '50mb', type: 'application/octet-stream' }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
    }),
  );

  const port = configService.get<number>('app.port' as any) ?? 3000;
  await app.listen(port);
  console.log(`Server running on port ${port} with prefix /${apiPrefix}`);
}

bootstrap();
