import {
  SearchQueryInput,
  UpdatePriceInput,
  UpdatePricesInput,
} from './dto/steam-market-prices.input';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SteamMarketItem } from './models/steam-market-item.model';
import { SteamMarketPricesService } from './steam-market-prices.service';

@Resolver(() => SteamMarketItem)
export class SteamMarketPricesResolver {
  constructor(
    private readonly steamMarketPricesService: SteamMarketPricesService,
  ) {}

  @Mutation(() => SteamMarketItem)
  async updatePrice(
    @Args('name') name: string,
    @Args('dto') dto: UpdatePriceInput,
  ) {
    return await this.steamMarketPricesService.updatePriceByName(name, dto);
  }

  @Query(() => SteamMarketItem)
  async searchByPrice(@Args('query') query: SearchQueryInput) {
    return await this.steamMarketPricesService.search(query);
  }

  @Mutation(() => SteamMarketItem)
  async updatePrices(@Args('dto') dto: UpdatePricesInput) {
    return await this.steamMarketPricesService.addJob(dto);
  }
}
