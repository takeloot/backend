import { InventoryModule } from './../inventory/inventory.module';
import { Logger, Module } from '@nestjs/common';
import { SellService } from './sell.service';
import { SellResolver } from './sell.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { SteamBotModule } from '../steam-bot/steam-bot.module';
import { BullModule } from '@nestjs/bull';
import { SELL_QUEUE } from './sell.constants';
import { SellFacade } from './sell.facade';
import { SellConsumer } from './sell.consumer';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    InventoryModule,
    SteamBotModule,
    BullModule.registerQueue({
      name: SELL_QUEUE,
    }),
  ],
  providers: [SellResolver, SellService, SellFacade, SellConsumer, Logger],
  exports: [SellFacade],
})
export class SellModule {}
