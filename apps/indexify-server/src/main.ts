import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import swaggerConfig from 'config/swagger.config';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Middle ware
  // await app.register(fastifyCookie, {
  //   secret: process.env.COOKIES_SIGNATURE_SECRET, // for cookies signature
  // });

  // Customize CORS options if needed
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  // Swagger Config
  swaggerConfig(app);

  await app.listen(5000);
}
bootstrap();
