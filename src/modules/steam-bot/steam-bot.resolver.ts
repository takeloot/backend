import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { SteamBotModel } from './models/steam-bot.model';
import { SteamBotService } from './steam-bot.service';

@Resolver(() => SteamBotModel)
export class SteamBotResolver {
  constructor(private steamBotService: SteamBotService) {}

  @Query(() => SteamBotModel, { nullable: true })
  async steamBot(@Args('id', { type: () => ID }) id: string) {
    return await this.steamBotService.getSteamBotById(id);
  }

  @Query(() => [SteamBotModel])
  // limit=60
  // offset=0
  // order=desc
  async steamBots() {
    return await this.steamBotService.getSteamBots();
  }
}
