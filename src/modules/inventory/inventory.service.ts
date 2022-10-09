import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import SteamCommunity from 'steamcommunity';
import { Inventory } from './models/inventory.model';
import { MinioService } from 'nestjs-minio-client';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

const community = new SteamCommunity();
const steamImageURL = 'https://steamcommunity-a.akamaihd.net/economy/image/';

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private readonly minioService: MinioService,
    @InjectQueue('inventory-images-queue')
    private readonly inventoryQueue: Queue,
  ) {}

  async uploadImageToBucket({ name, buffer }) {
    return await this.minioService.client.putObject(
      'steam',
      `${name}.png`,
      buffer,
    );
  }

  async updateSkinImage({ skinId, skinImgURL }) {
    return await this.prisma.skin.update({
      where: {
        id: skinId,
      },
      data: {
        img: skinImgURL,
      },
    });
  }

  async fillInventoryWithSkins({
    appId,
    steamId,
    tradableSkinsOnly,
    language,
    inventoryId,
  }) {
    try {
      return await community.getUserInventoryContents(
        steamId,
        appId,
        2,
        tradableSkinsOnly,
        language,
        // @ts-ignore: TODO: add types
        async (e, steamInventory) => {
          for (let i = 0; i < steamInventory.length; i++) {
            const steamSkin = steamInventory[i];

            const steamSkinImageURL = `${steamImageURL}${steamSkin.icon_url_large}`;

            const skin = await this.prisma.skin.upsert({
              where: {
                steamId: steamSkin.id,
              },
              update: {},
              create: {
                appId,
                assetId: steamSkin.assetid || null,
                steamId: steamSkin.id,
                steamImg: steamSkinImageURL,
                steamName: steamSkin.market_name,
                inventory: {
                  connect: {
                    id: inventoryId,
                  },
                },
              },
            });

            console.log({ skin });

            // try {
            //   await this.inventoryQueue.add('upload', {
            //     name: `${steamSkin.id}-${steamSkin.assetid}`,
            //     url: steamSkinImageURL,
            //     skinId: skin.id,
            //   });
            // } catch (e) {
            //   console.log({ e });
            // }
          }
        },
      );
    } catch (error) {
      Logger.error(error);
    }
  }

  allowRefetchSteamInventory({ inventoryCreatedAtMs, inventoryUpdatedAtMs }) {
    if (inventoryCreatedAtMs === inventoryUpdatedAtMs) {
      return true;
    }

    const now = +new Date();
    const inventoryLastUpdatedMs = Math.abs(now - inventoryUpdatedAtMs);
    const ONE_MINUTE_MS = 60000;
    const REFETCH_LIMIT_MINUTES = 1;
    const refetchLimitMs = REFETCH_LIMIT_MINUTES * ONE_MINUTE_MS;

    return inventoryLastUpdatedMs > refetchLimitMs;
  }

  // TODO: Fix getting inventory from first query
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
      await this.fillInventoryWithSkins({
        appId,
        steamId,
        tradableSkinsOnly: false,
        language: null,
        inventoryId: userInventory.id,
      });

      await this.prisma.inventory.update({
        where: {
          id: userInventory.id,
        },
        data: {
          updatedAt: new Date().toISOString(),
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

    return result;
  }
}
