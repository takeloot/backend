import { Injectable } from '@nestjs/common';
import { CreateSteamBotInput } from './dto/create-steam-bot.input';
import { SteamBot } from './steam-bot';
import { of } from 'await-of';
import { SteamBotModel } from './models/steam-bot.model';
import { PrismaService } from '../prisma/prisma.service';
import { SendTradeOfferInput } from './dto/send-trade-offer.input';
import { EGame } from '@takeloot/dto';
import { ISendTradeOfferOptions } from './steam-bot.interfaces';
import { GetTradeOfferInput } from './dto/get-trade-offer.input';
import { CancelTradeOfferInput } from './dto/cancel-trade-offer.input';

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
        isDeactivated: false,
        sell: null,
      },
    });
  }

  async linkFreeBotToSell(sellId: string) {
    const freeBot = await this.prisma.steamBot.findFirst({
      where: {
        isDeactivated: false,
        sell: null,
      },
    });

    if (!freeBot) {
      throw new Error('No free bots');
    }

    const botWithLinkedSell = await this.prisma.steamBot.update({
      where: {
        id: freeBot.id,
      },
      data: {
        sell: {
          connect: {
            id: sellId,
          },
        },
      },
    });

    return botWithLinkedSell;
  }

  async sendTradeOffer(dto: SendTradeOfferInput) {
    const { accountName, tradeOfferLink, theirItems, giveItem } = dto;
    const steamBot = await this.prisma.steamBot.findUnique({
      where: {
        accountName,
      },
    });

    if (!steamBot) {
      throw new Error('Bot not found');
    }

    try {
      const bot = new SteamBot();
      let myItems = [];
      let identitySecret: string;
      if (giveItem) {
        const [item] = await bot.getInventoryItems(
          steamBot.cookies,
          EGame.CSGO,
        );
        myItems.push(item);
        myItems = myItems.filter((item) => item);

        identitySecret = steamBot.identitySecret;
      }

      const options: ISendTradeOfferOptions = {
        identitySecret,
        partner: tradeOfferLink,
        theirItems,
        myItems,
        cookies: steamBot.cookies,
      };

      return await bot.sendTradeOffer(options);
    } catch (err) {
      const causeToException = new Map();
      causeToException.set('TradeBan', 'Trade ban');
      causeToException.set('TargetCannotTrade', 'Target cannot trade');
      causeToException.set('ItemServerUnavailable', 'Item server unavailable');

      if (err.cause) {
        const Exception = causeToException.get(err.cause);
        if (Exception) throw new Exception();
      }

      const messageToException = new Map();
      messageToException.set(
        'There was an error sending your trade offer. Please try again later. (26)',
        'Invalid trade offer link',
      );

      const Exception = messageToException.get(err.message);
      if (Exception) throw new Exception();

      throw new Error(err.message);
    }
  }

  async getTradeOffer(dto: GetTradeOfferInput) {
    const { accountName, tradeId } = dto;
    const steamBot = await this.prisma.steamBot.findUnique({
      where: {
        accountName,
      },
    });

    if (!steamBot) {
      throw new Error(`Bot ${accountName} not found`);
    }

    try {
      const bot = new SteamBot();
      return await bot.getTradeOffer({ tradeId, cookies: steamBot.cookies });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async cancelTradeOffer(dto: CancelTradeOfferInput) {
    const { accountName, tradeId } = dto;
    const steamBot = await this.prisma.steamBot.findUnique({
      where: {
        accountName,
      },
    });

    if (!steamBot) {
      throw new Error(`Bot ${accountName} not found`);
    }

    try {
      const bot = new SteamBot();
      await bot.cancelTradeOffer({ tradeId, cookies: steamBot.cookies });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deactivateBot(accountName: string) {
    return await this.prisma.steamBot.update({
      where: {
        accountName,
      },
      data: {
        isDeactivated: true,
      },
    });
  }

  async freeBot(accountName: string) {
    return await this.prisma.steamBot.update({
      where: {
        accountName,
      },
      data: {
        sell: {
          disconnect: true,
        },
      },
    });
  }

  async refreshBotCookies(accountName: string) {
    const steamBot = await this.prisma.steamBot.findUnique({
      where: {
        accountName,
      },
    });

    if (!steamBot) {
      throw new Error('Bot not found');
    }

    const bot = new SteamBot({ accountName, password: steamBot.password });
    const cookies = await bot.login({ sharedSecret: steamBot.sharedSecret });

    return await this.prisma.steamBot.update({
      where: {
        accountName,
      },
      data: {
        cookies,
      },
    });
  }

  async getSteamBotById(id: string) {
    return await this.prisma.steamBot.findUnique({
      where: {
        id,
      },
    });
  }

  async getSteamBots() {
    return await this.prisma.steamBot.findMany();
  }
}
