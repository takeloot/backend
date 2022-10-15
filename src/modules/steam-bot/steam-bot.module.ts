import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SteamBotController } from './steam-bot.controller';
import { SteamBotService } from './steam-bot.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [SteamBotController],
  providers: [SteamBotService],
})
export class SteamBotModule {}
