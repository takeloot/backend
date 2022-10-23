import {
  UpdatePriceInput,
  SearchQueryInput,
} from './dto/steam-market-prices.input';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { SteamMarketItem } from './models/steam-market-item.model';
import { ISteamMarketUpdatePricesJob } from './steam-market-prices.interfaces';
import {
  STEAM_MARKET_PRICES_QUEUE,
  UPDATE_PRICES_JOB,
} from './steam-market-prices.constants';

@Injectable()
export class SteamMarketPricesService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue(STEAM_MARKET_PRICES_QUEUE)
    private steamMarketPricesQueue: Queue<ISteamMarketUpdatePricesJob>,
  ) {}

  async getActiveJobs() {
    return await this.steamMarketPricesQueue.getActive();
  }

  async addJob(job: ISteamMarketUpdatePricesJob) {
    return await this.steamMarketPricesQueue.add(UPDATE_PRICES_JOB, job);
  }

  async save(items: SteamMarketItem[]) {
    return await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.steamMarketItem.upsert({
          where: { name: item.name },
          update: { ...item },
          create: { ...item },
        }),
      ),
    );
  }

  async updatePriceByName(name: string, dto: UpdatePriceInput) {
    const { price } = dto;

    const item = await this.prisma.steamMarketItem.findUnique({
      where: { name },
    });

    if (!item) {
      throw new Error('Item not found');
    }

    return await this.prisma.steamMarketItem.update({
      where: { name },
      data: { price },
    });
  }

  async search(dto: SearchQueryInput) {
    const { name, price, compare, limit } = dto;

    return await this.prisma.steamMarketItem.findMany({
      where: {
        name: {
          contains: name,
        },
        price: {
          [compare]: price,
        },
      },
      take: limit,
    });
  }
}
