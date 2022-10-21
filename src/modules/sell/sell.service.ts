import { Injectable } from '@nestjs/common';
import { InventoryService } from '../inventory/inventory.service';
import { Skin } from '../inventory/models/skin.model';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSellInput } from './dto/create-sell.input';
import { Sell } from './models/sell.model';

@Injectable()
export class SellService {
  constructor(
    private prisma: PrismaService,
    private readonly inventoryService: InventoryService,
  ) {}

  async getActive({ userId }) {
    return await this.prisma.sell.findFirst({
      where: {
        userId,
      },
    });
  }

  async create({ dto, userId }: { dto: CreateSellInput; userId: string }) {
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

    try {
      // TODO: check has active sell
      const haveActiveSell = false;

      if (haveActiveSell) {
        throw new Error('You already have active sell');
      }

      const sell = new Sell();
      sell.user = user;
      sell.items = sellItems;
      sell.totalItemsPrice = totalItemsPrice;
      // sell.ip = options.ip;
      // sell.userAgent = options.userAgent;
      // TODO: replace with real options
      sell.ip = '';
      sell.userAgent = '';
      sell.paymentProvider = paymentProvider;
      sell.wallet = wallet;
      sell.email = email;

      // TODO: check if sell variation is automatic and set sell status to accepted by support

      const createdSell = await this.prisma.sell.create({
        data: sell,
      });

      // TODO: check if sell variation is automatic and add execute trade stage job

      return createdSell;
    } catch (err) {
      // delete prisma sell
      throw new Error(err);
    }
  }
}
