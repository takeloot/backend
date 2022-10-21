import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InventoryService } from '../inventory/inventory.service';
import { Skin } from '../inventory/models/skin.model';
import { PrismaService } from '../prisma/prisma.service';
import { SteamBotService } from '../steam-bot/steam-bot.service';
import { CreateSellInput } from './dto/create-sell.input';
import { ESellStatus, Sell } from './models/sell.model';
import { EXECUTE_TRADE_STAGE_JOB } from './sell.constants';
import { IExecuteTradeStageJob } from './sell.interfaces';

@Injectable()
export class SellService {
  constructor(
    private prisma: PrismaService,
    private readonly inventoryService: InventoryService,
    private readonly steamBotService: SteamBotService,
    @InjectQueue('SELL_QUEUE')
    private readonly sellQueue: Queue,
  ) {}

  private readonly logger = new Logger(SellService.name);

  async create({
    dto,
    userId,
    ip,
    userAgent,
  }: {
    dto: CreateSellInput;
    userId: string;
    ip: string;
    userAgent: string;
  }) {
    const workStatuses = await this.prisma.workStatuses.findFirst({
      where: {
        pk: 1,
      },
    });

    if (workStatuses.isSellDisabled) {
      throw new Error('Sell is disabled');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    const userHasTradeUrl = user.tradeUrl;

    if (!userHasTradeUrl) {
      throw new Error('User has no trade url');
    }

    const { items, paymentProvider, wallet, email } = dto;

    const sellItems: Skin[] = [];

    let totalItemsPrice = 0;

    for await (const item of items) {
      const userInventoryItem = await this.inventoryService.getUserItemById({
        id: item.id,
      });

      if (
        !userInventoryItem ||
        userInventoryItem?.isBlacklisted ||
        userInventoryItem?.price !== item.price
      ) {
        throw new Error('Price changed');
      }

      const sellItem = new Skin();
      sellItem.appId = userInventoryItem.appId;
      sellItem.assetId = userInventoryItem.assetId;
      sellItem.name = userInventoryItem.name;
      sellItem.img = userInventoryItem.img;
      sellItem.price = Number(userInventoryItem.price);
      sellItem.rubPrice = Number(userInventoryItem.rubPrice);
      sellItem.stickers = userInventoryItem.stickers;
      sellItem.rarity = userInventoryItem.rarity;
      sellItem.rarityColor = userInventoryItem.rarityColor;

      totalItemsPrice += sellItem.price;
      totalItemsPrice = Number(totalItemsPrice.toFixed(2));

      sellItems.push(sellItem);
    }

    let createdSell;

    try {
      const haveActiveSell = await this.getUserActiveSell({ userId });

      if (haveActiveSell) {
        throw new Error('You already have active sell');
      }

      const sell = new Sell();
      sell.user = user;
      sell.items = sellItems;
      sell.totalItemsPrice = totalItemsPrice;
      sell.ip = ip;
      sell.userAgent = userAgent;
      sell.paymentProvider = paymentProvider;
      sell.wallet = wallet;
      sell.email = email;

      // TODO: check sell variation from admin settings
      const isAutomaticSellVariation = true;

      if (isAutomaticSellVariation) {
        const bot = await this.steamBotService.getFreeBot();

        if (!bot) {
          throw new Error('No free bots');
        }

        sell.steamBot = bot;
        sell.status = ESellStatus.ACCEPTED_BY_SUPPORT;
      }

      createdSell = await this.prisma.sell.create({
        data: sell,
      });

      // TODO: check sell variation from admin settings
      if (isAutomaticSellVariation) {
        await this.addExecuteTradeStageJob({ sellId: createdSell.id });
      }

      return createdSell;
    } catch (err) {
      await this.prisma.sell.delete({
        where: createdSell.id,
      });

      throw new Error(err);
    } finally {
      this.logger.debug(`Sell created: ${createdSell.id}`);
    }
  }

  async addExecuteTradeStageJob(jobData: IExecuteTradeStageJob) {
    await this.sellQueue.add(EXECUTE_TRADE_STAGE_JOB, jobData);
  }

  async getUserActiveSell({ userId }) {
    return await this.prisma.sell.findFirst({
      where: {
        userId,
        OR: [
          {
            status: ESellStatus.WAITING_SUPPORT_ACCEPT,
          },
          {
            status: ESellStatus.ACCEPTED_BY_SUPPORT,
          },
          {
            status: ESellStatus.WAITING_USER_TRADE_CONFIRMATION,
          },
        ],
      },
    });
  }
}
