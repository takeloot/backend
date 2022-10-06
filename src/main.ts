import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import session from 'express-session';
import connectRedis from 'connect-redis';
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
        client: new Redis({
          host: config.get('db.redisHost'),
          port: config.get('db.redisPort'),
          autoResubscribe: true,
          enableOfflineQueue: true,
          retryStrategy: () => {
            return 2000;
          },
          lazyConnect: true,
          enableAutoPipelining: true,
          connectTimeout: 5000,
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
          reconnectOnError: (err) => {
            return err.message.startsWith('READONLY');
          },
        }),
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
