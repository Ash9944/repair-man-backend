import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
// Import from the pre-built dist — avoids src/ path-alias issues at runtime
import { AppModule } from '../dist/app.module';
import { ConfigService } from '@nestjs/config';

const expressApp = express();
let initialized = false;

async function bootstrap() {
  if (initialized) return;

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: ['error', 'warn'] },
  );

  const configService = app.get(ConfigService);

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

  const apiPrefix = configService.get<string>('app.apiPrefix' as any) ?? 'api';
  app.setGlobalPrefix(apiPrefix);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
    }),
  );

  // init() instead of listen() — Vercel manages the HTTP layer
  await app.init();
  initialized = true;
}

export default async function handler(req: any, res: any) {
  await bootstrap();
  expressApp(req, res);
}
