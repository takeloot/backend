import { User } from './../user/models/user.model';
import { SteamBotModel } from './../steam-bot/models/steam-bot.model';
import { Injectable, Logger } from '@nestjs/common';
import { SellStatus } from '@prisma/client';
import { of } from 'await-of';
import { SteamBotService } from '../steam-bot/steam-bot.service';
import { MOVE_TO_PAYOUT_STAGE_JOB } from './sell.constants';
import { SellService } from './sell.service';
import { ISteamEconItem } from '../steam-bot/steam-bot.interfaces';
import { InventoryService } from '../inventory/inventory.service';
import { DateUtil, TimePeriod } from 'src/common/classes/date-util';

@Injectable()
export class SellFacade {
  constructor(
    private sellService: SellService,
    private steamBotService: SteamBotService,
    private logger: Logger,
    private inventoryService: InventoryService,
  ) {}

  async accept(id: string) {
    const steamBot = await this.steamBotService.linkFreeBotToSell(id);

    try {
      const sell = await this.sellService.acceptSell(id);

      // TODO: add subscription
      // sellStatusChanged(sell.user.id.toString(), {
      //   id: sell.id,
      //   status: SellStatus.ACCEPTED_BY_SUPPORT,
      // });

      await this.sellService.addExecuteTradeStageJob({ sellId: id });
    } catch (e) {
      await this.steamBotService.freeBot(steamBot.accountName);
    }
  }

  async executeTradeStage(id: string) {
    const { user, steamBot, items } = await this.sellService.getById(id);
    const steamEconItems: ISteamEconItem[] = items.map(
      ({ assetId, appId }) => ({
        assetid: assetId,
        appid: appId,
        contextid: 2,
      }),
    );

    const [sendTradeOfferResult, err] = await of(
      this.steamBotService.sendTradeOffer({
        accountName: steamBot.accountName,
        theirItems: steamEconItems,
        tradeOfferLink: user.tradeUrl,
        giveItem: false,
      }),
    );

    err && this.logger.error({ err });

    const isTradeNotSent = !!(err || sendTradeOfferResult?.status !== 'sent');

    if (isTradeNotSent) {
      // @ts-ignore
      if (err.message.includes('Not Logged In')) {
        try {
          await this.steamBotService.refreshBotCookies(steamBot.accountName);
          return await this.executeTradeStage(id);
        } catch (err) {
          const context = `${SellFacade.name}.executeTradeStage`;
          this.logger.log(err.message, context);
        }
      }

      return await this.makeSellFailed(steamBot, id, user, err);
    }

    const { tradeId, myItems } = sendTradeOfferResult;

    const givenItem = {
      // @ts-ignore
      name: myItems[0]?.market_hash_name,
      // @ts-ignore
      image: myItems[0]?.getImageURL(),
    };
    const acceptTradeUntil = DateUtil.addPeriodToNow(TimePeriod.Minute, 10);

    await this.sellService.updateTradeId(id, tradeId);
    await this.sellService.updateGivenItem(id, givenItem);
    await this.sellService.updateSellStatus(
      id,
      SellStatus.WAITING_USER_TRADE_CONFIRMATION,
    );
    await this.sellService.updateAcceptTradeUntil(id, acceptTradeUntil);

    // TODO: subscription
    // sellStatusChanged(user.id.toString(), {
    //   id: id,
    //   status: SellStatus.WAITING_USER_TRADE_CONFIRMATION,
    //   tradeId,
    //   // @ts-ignore
    //   bot: {
    //     name: steamBot.name,
    //     avatar: steamBot.avatar,
    //     profileUrl: steamBot.profileUrl,
    //   },
    //   givenItem,
    //   items: items.splice(0, 3).filter((item) => item),
    //   acceptTradeUntil,
    // });

    await this.sellService.addRepeatableMoveToPayoutStageJob(
      { sellId: id },
      60_000,
    );
  }

  async moveToPayoutStage(sellId: string) {
    const sell = await this.sellService.getById(sellId);
    const [isAcceptedTrade, err] = await of(
      this.sellService.checkIfUserAcceptedTrade(sellId),
    );

    if (err) {
      // TODO: add isDeclinedTrade execution
      const isDeclinedTrade = false;
      if (isDeclinedTrade) {
        await this.steamBotService.freeBot(sell.steamBot.accountName);
        await this.sellService.updateSellStatus(
          sellId,
          SellStatus.TRADE_DECLINED_BY_USER,
        );
        await this.sellService.removeJob(
          ['delayed'],
          MOVE_TO_PAYOUT_STAGE_JOB,
          sellId,
        );

        // TODO: subscription
        // sellStatusChanged(sell.user.id.toString(), {
        //   id: sellId,
        //   status: SellStatus.TRADE_DECLINED_BY_USER,
        // });
      }

      return;
    }

    if (isAcceptedTrade) {
      await this.inventoryService.deleteItemsByAssetIds(
        sell.items.map((item) => item.assetId),
      );
      await this.steamBotService.deactivateBot(sell.steamBot.accountName);
      await this.sellService.removeJob(
        ['delayed'],
        MOVE_TO_PAYOUT_STAGE_JOB,
        sellId,
      );

      await this.sellService.updateSellStatus(
        sellId,
        SellStatus.TRADE_ACCEPTED_BY_USER,
      );
      // TODO: subscription
      // sellStatusChanged(sell.user.id.toString(), {
      //   id: sell.id,
      //   status: SellStatus.TRADE_ACCEPTED_BY_USER,
      // });

      const isAllItemsReceived = await this.sellService.checkIfAllItemsReceived(
        sellId,
      );
      if (!isAllItemsReceived) {
        return await this.makeSellFailed(
          sell.steamBot,
          sell.id,
          sell.user,
          new Error('Not all items present'),
        );
      }

      await this.sellService.updateSellStatus(
        sellId,
        SellStatus.PAY_REQUEST_TO_MERCHANT,
      );
      // TODO: subscription
      // sellStatusChanged(sell.user.id.toString(), {
      //   id: sell.id,
      //   status: SellStatus.PAY_REQUEST_TO_MERCHANT,
      // });

      return await this.sellService.addExecutePayoutStageJob({ sellId });
    }

    const isTradeAcceptTimeoutExceeded =
      sell.acceptTradeUntil?.getTime() <= Date.now();
    if (isTradeAcceptTimeoutExceeded) {
      await this.sellService.cancelSellCauseTradeTimeoutExceeded(sell.id);
      if (sell.steamBot && sell.tradeId) {
        await this.steamBotService.cancelTradeOffer({
          accountName: sell.steamBot.accountName,
          tradeId: sell.tradeId,
        });
        // TODO: subscription
        // sellStatusChanged(sell.user.id.toString(), {
        //   id: sell.id,
        //   status: SellStatus.TRADE_TIMEOUT_EXCEEDED,
        // });

        await this.sellService.removeJob(
          ['delayed'],
          MOVE_TO_PAYOUT_STAGE_JOB,
          sell.id,
        );
      }
    }
  }

  async getUserSalesSum(userId: string) {
    return await this.sellService.getTotalSumOfCompletedSales(userId);
  }

  async makeSellFailed(bot: SteamBotModel, id: string, user: User, err: Error) {
    await this.steamBotService.freeBot(bot.accountName);
    await this.sellService.updateSellStatus(id, SellStatus.FAILED);
    await this.sellService.updateError(id, err.message);

    // TODO: subscription
    // sellStatusChanged(user.id.toString(), {
    //   id,
    //   status: SellStatus.FAILED,
    //   error: err.constructor.name,
    // });
  }
}
