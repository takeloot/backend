import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma, SellStatus } from '@prisma/client';
import { of } from 'await-of';
import { JobStatus, Queue } from 'bull';
import { InventoryService } from '../inventory/inventory.service';
import { Skin } from '../inventory/models/skin.model';
import { PrismaService } from '../prisma/prisma.service';
import { SteamBotService } from '../steam-bot/steam-bot.service';
import { CreateSellInput } from './dto/create-sell.input';
import { ESellStatus, Sell } from './models/sell.model';
import {
  EXECUTE_PAYOUT_STAGE_JOB,
  EXECUTE_TRADE_STAGE_JOB,
  MOVE_TO_PAYOUT_STAGE_JOB,
  SELL_QUEUE,
} from './sell.constants';
import {
  ETradeOfferState,
  IExecutePayoutStageJob,
  IExecuteTradeStageJob,
  IMoveToPayoutStageJob,
} from './sell.interfaces';

@Injectable()
export class SellService {
  constructor(
    private prisma: PrismaService,
    private readonly inventoryService: InventoryService,
    private readonly steamBotService: SteamBotService,
    @InjectQueue(SELL_QUEUE)
    private readonly sellQueue: Queue,
  ) {}

  private readonly logger = new Logger(SellService.name);

  async addExecutePayoutStageJob(jobData: IExecutePayoutStageJob) {
    await this.sellQueue.add(EXECUTE_PAYOUT_STAGE_JOB, jobData);
  }

  async getById(id: string) {
    return this.prisma.sell.findFirst({
      where: {
        id,
      },
      include: {
        items: true,
        steamBot: true,
        user: true,
      },
    });
  }

  async create({
    dto,
    userId,
    ip,
  }: // userAgent,
  {
    dto: CreateSellInput;
    userId: string;
    ip: string;
    // userAgent: string;
  }) {
    const workStatuses = await this.prisma.workStatuses.findFirst({
      where: {
        pk: 1,
      },
    });

    if (!workStatuses.isSellEnabled) {
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

    const {
      items,
      // paymentProvider,
      // wallet,
      // email
    } = dto;

    const sellItems: Skin[] = [];

    let totalItemsPrice = 0;

    for await (const item of items) {
      const userInventoryItem = await this.inventoryService.getUserItemById({
        id: item.id,
      });

      // if (
      //   !userInventoryItem ||
      //   userInventoryItem?.isBlacklisted ||
      //   userInventoryItem?.price !== item.price
      // ) {
      //   throw new Error('Price changed');
      // }

      const sellItem = new Skin();
      sellItem.id = userInventoryItem.id;
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
      // sell.user = user;
      // sell.items = sellItems;
      sell.totalItemsPrice = totalItemsPrice;
      sell.ip = ip;
      // sell.userAgent = userAgent;
      // sell.paymentProvider = paymentProvider;
      // sell.wallet = wallet;
      // sell.email = email;
      sell.userAgent = '';
      sell.paymentProvider = '';
      sell.wallet = '';
      sell.email = '';

      // TODO: check sell variation from admin settings
      const isAutomaticSellVariation = true;

      const bot = await this.steamBotService.getFreeBot();

      if (!bot) {
        throw new Error('No free bots');
      }

      if (isAutomaticSellVariation) {
        // sell.steamBot = bot;
        sell.status = ESellStatus.ACCEPTED_BY_SUPPORT;
      }

      const sellItemsIds = sellItems.map((item) => ({
        id: item.id,
      }));

      createdSell = await this.prisma.sell.create({
        data: {
          ...sell,
          items: {
            connect: [...sellItemsIds],
          },
          user: {
            connect: {
              id: user.id,
            },
          },
          steamBot: {
            connect: {
              id: bot.id,
            },
          },
        },
        include: {
          items: true,
          steamBot: true,
          user: true,
        },
      });

      // TODO: check sell variation from admin settings
      if (isAutomaticSellVariation) {
        await this.addExecuteTradeStageJob({ sellId: createdSell.id });
      }

      return createdSell;
    } catch (err) {
      if (createdSell) {
        await this.prisma.sell.delete({
          where: {
            id: createdSell.id,
          },
        });
      }

      throw new Error(err);
    }
  }

  async acceptSell(id: string) {
    let acceptedSell;
    try {
      const sell = await this.prisma.sell.findFirst({
        where: {
          id,
          status: ESellStatus.WAITING_SUPPORT_ACCEPT,
        },
        include: {
          items: true,
          user: true,
        },
      });

      if (!sell) {
        throw new Error('Sell not found');
      }

      acceptedSell = await this.prisma.sell.update({
        where: {
          id,
        },
        data: {
          status: ESellStatus.ACCEPTED_BY_SUPPORT,
        },
      });

      return acceptedSell;
    } catch (err) {
      await this.prisma.sell.update({
        where: acceptedSell.id,
        data: {
          status: ESellStatus.WAITING_SUPPORT_ACCEPT,
        },
      });

      throw new Error(err.message);
    } finally {
      this.logger.debug(`Sell accepted: ${id}`);
    }
  }

  async updateGivenItem(id: string, givenItem: Prisma.JsonValue) {
    return this.prisma.sell.update({
      where: {
        id,
      },
      data: {
        givenItem,
      },
    });
  }

  async removeJob(status: JobStatus[], name: string, sellId: string) {
    const jobs = await this.sellQueue.getJobs(status);
    for await (const job of jobs) {
      if (job.name === name && job.data?.sellId === sellId) {
        await job.remove();
      }
    }
  }

  async addExecuteTradeStageJob(jobData: IExecuteTradeStageJob) {
    return await this.sellQueue.add(EXECUTE_TRADE_STAGE_JOB, jobData);
  }

  async addRepeatableMoveToPayoutStageJob(
    jobData: IMoveToPayoutStageJob,
    intervalMs: number,
  ) {
    await this.sellQueue.add(MOVE_TO_PAYOUT_STAGE_JOB, jobData, {
      repeat: { every: intervalMs },
    });
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

  async checkIfUserAcceptedTrade(id: string) {
    const sell = await this.prisma.sell.findFirst({
      where: {
        id,
      },
      include: {
        user: true,
        steamBot: true,
      },
    });

    const [offer, err] = await of(
      this.steamBotService.getTradeOffer({
        accountName: sell.steamBot.accountName,
        tradeId: sell.tradeId,
      }),
    );

    this.logger.debug(err + 'sell check if accepted ');
    if (err) throw err;

    this.logger.debug(offer.itemsToReceive);
    this.logger.debug(offer.state);

    const declinedTradeStates = [
      ETradeOfferState.Canceled,
      ETradeOfferState.CanceledBySecondFactor,
      ETradeOfferState.Countered,
      ETradeOfferState.Declined,
      ETradeOfferState.Invalid,
      ETradeOfferState.InvalidItems,
      ETradeOfferState.InEscrow,
    ];

    if (offer.state === ETradeOfferState.Accepted) return true;
    else if (declinedTradeStates.includes(offer.state))
      throw new Error('User decline trade');
    else return false;
  }

  async updateTradeId(id: string, tradeId: string) {
    return await this.prisma.sell.update({
      where: {
        id,
      },
      data: {
        tradeId,
      },
    });
  }

  async updateSellStatus(id: string, status: SellStatus) {
    return await this.prisma.sell.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  async updateError(id: string, error: string) {
    return await this.prisma.sell.update({
      where: {
        id,
      },
      data: {
        error,
      },
    });
  }

  async cancelSellCauseTradeTimeoutExceeded(id: string) {
    let cancelSell;
    try {
      const sell = await this.prisma.sell.findFirst({
        where: {
          id,
          status: ESellStatus.WAITING_USER_TRADE_CONFIRMATION,
        },
        include: {
          steamBot: true,
        },
      });

      if (!sell) {
        throw new Error('Sell not found');
      }

      cancelSell = await this.prisma.sell.update({
        where: {
          id,
        },
        data: {
          status: ESellStatus.TRADE_TIMEOUT_EXCEEDED,
          steamBotId: null,
        },
      });

      return cancelSell;
    } catch (err) {
      await this.prisma.sell.update({
        where: cancelSell.id,
        data: {
          status: ESellStatus.WAITING_USER_TRADE_CONFIRMATION,
        },
      });
      throw new Error(err.message);
    } finally {
      this.logger.debug(`Sell canceled: ${id}`);
    }
  }

  async checkIfAllItemsReceived(sellId: string) {
    const sell = await this.prisma.sell.findFirst({
      where: {
        id: sellId,
      },
      include: {
        items: true,
        steamBot: true,
      },
    });
    const tradeOffer = await this.steamBotService.getTradeOffer({
      tradeId: sell.tradeId,
      accountName: sell.steamBot.accountName,
    });

    return sell.items.every((item) =>
      tradeOffer.itemsToReceive.find(
        (itemToReceive) => itemToReceive.assetid === item.assetId,
      ),
    );
  }

  async updateAcceptTradeUntil(sellId: string, acceptTradeUntil: Date) {
    return await this.prisma.sell.update({
      where: {
        id: sellId,
      },
      data: {
        acceptTradeUntil,
      },
    });
  }

  async getTotalSumOfCompletedSales(userId: string) {
    // TODO: calculate total sum of completed sales
    return 0;
  }
}
