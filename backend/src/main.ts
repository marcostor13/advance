import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

/** Dominios públicos del sitio: permitidos aunque falte FRONTEND_URL en el entorno. */
const DEFAULT_ORIGINS = ['https://advance-group.pe', 'https://www.advance-group.pe'];

/** El Origin del navegador nunca trae barra final ni mayúsculas; el env sí puede. */
function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/+$/, '').toLowerCase();
}

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const allowedOrigins = new Set(
    [...DEFAULT_ORIGINS, ...(process.env.FRONTEND_URL ?? '').split(',')]
      .map(normalizeOrigin)
      .filter(Boolean),
  );
  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.add('http://localhost:4200');
  }
  logger.log(`CORS habilitado para: ${[...allowedOrigins].join(', ')}`);

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Sin Origin = petición no-navegador (curl, healthcheck, server-to-server).
      if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
        callback(null, true);
        return;
      }
      // Rechazar sin lanzar: el navegador ya bloquea por falta de cabecera y
      // el preflight responde limpio en vez de un 500 con stack trace.
      logger.warn(`CORS: origen no permitido → ${origin}. Revisar FRONTEND_URL.`);
      callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Advance Group API')
    .setDescription('API del Grupo Financiero Advance — Factoring y Capital')
    .setVersion('1.0')
    .addTag('health')
    .addTag('contact')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`API running on port ${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
