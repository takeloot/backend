import { Injectable } from '@nestjs/common';
import { CreateSteamBotInput } from './dto/create-steam-bot.input';
import { SteamBot } from './steam-bot';
import { of } from 'await-of';
import { SteamBotModel } from './models/steam-bot.model';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SteamBotService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSteamBotInput) {
    const { accountName, password, maFile, proxy } = dto;

    let sharedSecret: string;
    let identitySecret: string;

    try {
      const { shared_secret, identity_secret } = JSON.parse(
        maFile.buffer.toString(),
      );
      sharedSecret = shared_secret;
      identitySecret = identity_secret;
    } catch (err) {
      throw new Error('Invalid maFile');
    }

    if (!sharedSecret || !identitySecret) {
      throw new Error('Invalid maFile');
    }

    const bot = new SteamBot({ accountName, password, proxy });
    const [cookies, err] = await of(bot.login({ sharedSecret }));

    if (err) {
      if (err.message.includes('tunneling socket could not be established')) {
        throw new Error('Proxy error');
      } else {
        throw new Error(err.message);
      }
    }

    // const tradeUrl = await bot.getTradeUrl();
    const botInfo = await bot.getAccountInfo();
    const steamBot = new SteamBotModel();

    steamBot.accountName = accountName;
    steamBot.password = password;
    steamBot.sharedSecret = sharedSecret;
    steamBot.identitySecret = identitySecret;
    steamBot.avatar = botInfo.avatar;
    steamBot.name = botInfo.name;
    steamBot.profileUrl = botInfo.profileUrl;
    // steamBot.tradeUrl = tradeUrl;
    steamBot.cookies = cookies;

    return await this.prisma.steamBot.create({
      data: steamBot,
    });
  }

  async getFreeBot() {
    return await this.prisma.steamBot.findFirst({
      where: {
        isDeativated: false,
        sell: null,
      },
    });
  }
}
