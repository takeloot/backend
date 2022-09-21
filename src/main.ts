import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import Redis from 'ioredis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
  });

  const config = app.get(ConfigService);

  const RedisStore = connectRedis(session);

  app.use(
    session({
      store: new RedisStore({
        client: new Redis(config.get('db.redisUrl')),
      }),
      secret: config.get('auth.sessionSecret'),
      name: 'appsessions',
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
