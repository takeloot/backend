import { Module } from '@nestjs/common';
import { SteamMarketPricesService } from './steam-market-prices.service';
import { SteamMarketPricesResolver } from './steam-market-prices.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { STEAM_MARKET_PRICES_QUEUE } from './steam-market-prices.constants';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: STEAM_MARKET_PRICES_QUEUE,
    }),
  ],
  providers: [SteamMarketPricesResolver, SteamMarketPricesService],
})
export class SteamMarketPricesModule {}
