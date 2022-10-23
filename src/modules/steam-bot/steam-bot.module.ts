import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SteamBotController } from './steam-bot.controller';
import { SteamBotResolver } from './steam-bot.resolver';
import { SteamBotService } from './steam-bot.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [SteamBotController],
  providers: [SteamBotResolver, SteamBotService],
  exports: [SteamBotService],
})
export class SteamBotModule {}
