import { Resolver, Query, Context, Args, Mutation, ID } from '@nestjs/graphql';
import { SellService } from './sell.service';
import { Sell } from './models/sell.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards';
import { CreateSellInput } from './dto/create-sell.input';

@Resolver(() => Sell)
export class SellResolver {
  constructor(private readonly sellService: SellService) {}

  @UseGuards(AuthGuard)
  @Query(() => Sell)
  async getActiveSell(@Context('userId') userId) {
    return this.sellService.getActive({ userId });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Sell)
  async createSell(
    @Args('dto') dto: CreateSellInput,
    @Args({ name: 'userId', type: () => ID })
    userId: string,
  ) {
    return this.sellService.create(dto, userId);
  }
}
