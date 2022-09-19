import { registerAs } from '@nestjs/config';

export const config = [
  registerAs('authSteam', () => ({
    returnURL: `${process.env.API_URL}authend/steam`,
    realm: process.env.API_URL,
    apiKey: process.env.STEAM_API_KEY,
  })),
];
