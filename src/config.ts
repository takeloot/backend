import { registerAs } from '@nestjs/config';
import { nanoid } from 'nanoid';

export const config = [
  registerAs('authSteam', () => ({
    returnURL: `${process.env.API_URL}authend/steam`,
    realm: process.env.API_URL,
    apiKey: process.env.STEAM_API_KEY,
  })),
  registerAs('base', () => ({
    instanceId: nanoid(10),
    apiURL: process.env.API_URL,
    baseURL: process.env.BASE_URL,
  })),
  registerAs('db', () => ({
    redisUrl: process.env.REDIS_URL,
  })),
];
