import { SteamMarketPricesConsumer } from './steam-market-prices.consumer';
import { Module } from '@nestjs/common';
import { SteamMarketPricesService } from './steam-market-prices.service';
import { SteamMarketPricesResolver } from './steam-market-prices.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { STEAM_MARKET_PRICES_QUEUE } from './steam-market-prices.constants';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: STEAM_MARKET_PRICES_QUEUE,
    }),
    HttpModule,
  ],
  providers: [
    SteamMarketPricesResolver,
    SteamMarketPricesService,
    SteamMarketPricesConsumer,
  ],
  exports: [SteamMarketPricesService],
})
export class SteamMarketPricesModule {}
