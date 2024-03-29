import { registerAs } from '@nestjs/config';
import { nanoid } from 'nanoid';

export const config = [
  registerAs('auth', () => ({
    sessionSecret: process.env.SESSION_SECRET,
  })),
  registerAs('authSteam', () => ({
    returnURL: `${process.env.API_URL}authend/steam`,
    realm: process.env.API_URL,
    apiKey: process.env.STEAM_API_KEY,
  })),
  registerAs('base', () => ({
    instanceId: nanoid(10),
    apiUrl: process.env.API_URL,
    baseUrl: process.env.BASE_URL,
    cdnUrl: process.env.CDN_URL,
  })),
  registerAs('db', () => ({
    redisUrl: process.env.REDIS_URL,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    minioEndPoint: process.env.MINIO_ENDPOINT,
    minioPort: process.env.MINIO_PORT,
    minioAccessKey: process.env.MINIO_ACCESS_KEY,
    minioSecretKey: process.env.MINIO_SECRET_KEY,
  })),
];
