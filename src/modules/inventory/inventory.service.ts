import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import SteamCommunity from 'steamcommunity';
import { Inventory } from './models/inventory.model';
import { MinioService } from 'nestjs-minio-client';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { INVENTORY_IMAGES_QUEUE } from './inventory.constants';

const community = new SteamCommunity();
const steamImageUrl = 'https://steamcommunity-a.akamaihd.net/economy/image/';

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private readonly minioService: MinioService,
    @InjectQueue(INVENTORY_IMAGES_QUEUE)
    private readonly inventoryQueue: Queue,
  ) {}

  async uploadImageToBucket({ name, buffer }) {
    this.minioService.client.removeObject('steam', `${name}.png`, buffer);

    return await this.minioService.client.putObject(
      'steam',
      `${name}.png`,
      buffer,
    );
  }

  async updateSkinImage({ skinId, skinImgUrl }) {
    return await this.prisma.skin.update({
      where: {
        id: skinId,
      },
      data: {
        img: skinImgUrl,
      },
    });
  }

  async getSteamMarketPrice(marketName: string) {
    const steamMarketItem = await this.prisma.steamMarketItem.findFirst({
      where: {
        name: marketName,
      },
    });

    if (!steamMarketItem) {
      return 0;
    }

    return steamMarketItem.price;
  }

  async fillInventoryWithSkins({
    appId,
    steamId,
    tradableSkinsOnly,
    language,
  }) {
    const result = [];

    const getSteamInventory = () =>
      new Promise<any[]>((resolve, reject) => {
        community.getUserInventoryContents(
          steamId,
          appId,
          2,
          tradableSkinsOnly,
          language,
          // @ts-ignore: TODO: add types
          async (error, steamInventory) => {
            if (!error) {
              resolve(steamInventory);
            } else {
              reject(new Error('Error while fetching steam inventory'));
            }
          },
        );
      });

    const inventory = await getSteamInventory();

    for (const steamSkin of inventory) {
      const steamSkinImageUrl = `${steamImageUrl}${
        steamSkin.icon_url_large || steamSkin.icon_url
      }`;

      const skin = {
        appId,
        assetId: steamSkin.assetid || null,
        steamId: steamSkin.id,
        steamImg: steamSkinImageUrl,
        steamName: steamSkin.market_name,
        defaultPrice: await this.getSteamMarketPrice(steamSkin.market_name),
      };

      result.push(skin);
    }

    return result;
  }

  allowRefetchSteamInventory({ inventoryCreatedAtMs, inventoryUpdatedAtMs }) {
    if (inventoryCreatedAtMs === inventoryUpdatedAtMs) {
      return true;
    }

    const now = +new Date();
    const inventoryLastUpdatedMs = Math.abs(now - inventoryUpdatedAtMs);
    const ONE_MINUTE_MS = 60000;
    const REFETCH_LIMIT_MINUTES = 5;
    const refetchLimitMs = REFETCH_LIMIT_MINUTES * ONE_MINUTE_MS;

    return inventoryLastUpdatedMs > refetchLimitMs;
  }

  async getUserInventory({ appId, userId }) {
    const userProfile = await this.prisma.profile.findFirst({
      where: { userId },
    });

    if (!userProfile) {
      throw new Error('This user was not found.');
    }

    const steamId = userProfile.serviceId;

    if (!steamId) {
      throw new Error('This Steam ID was not found.');
    }

    const userInventory: Inventory = await this.prisma.inventory.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    const isSteamInventoryRefetchAllow = this.allowRefetchSteamInventory({
      inventoryCreatedAtMs: +new Date(userInventory.createdAt),
      inventoryUpdatedAtMs: +new Date(userInventory.updatedAt),
    });

    if (isSteamInventoryRefetchAllow) {
      await this.prisma.skin.deleteMany({
        where: {
          inventoryId: userInventory.id,
        },
      });

      const skins = await this.fillInventoryWithSkins({
        appId,
        steamId,
        tradableSkinsOnly: false,
        language: null,
      });

      await this.prisma.inventory.update({
        where: {
          id: userInventory.id,
        },
        data: {
          updatedAt: new Date().toISOString(),
          skins: {
            createMany: {
              data: skins,
              skipDuplicates: true,
            },
          },
        },
        include: {
          skins: true,
        },
      });
    }

    const result = await this.prisma.inventory.findUnique({
      where: {
        id: userInventory.id,
      },
      include: { skins: true },
    });

    result.skins.forEach(async (skin) => {
      await this.inventoryQueue.add('upload', {
        name: `${skin.steamId}-${skin.assetId}`,
        url: skin.steamImg,
        skinId: skin.id,
      });
    });

    return result;
  }

  async getUserItemById({ id }) {
    return await this.prisma.skin.findUnique({
      where: {
        id,
      },
      include: {
        stickers: true,
      },
    });
  }

  async deleteItemsByAssetIds(assetIds: string[]) {
    return await this.prisma.skin.deleteMany({
      where: {
        assetId: {
          in: assetIds,
        },
      },
    });
  }
}
