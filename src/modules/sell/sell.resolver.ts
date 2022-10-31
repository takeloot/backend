import {
  Resolver,
  Args,
  Mutation,
  ID,
  Subscription,
  Context,
  Query,
} from '@nestjs/graphql';
import { SellService } from './sell.service';
import { Sell } from './models/sell.model';
import { Inject, Ip, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards';
import { CreateSellInput } from './dto/create-sell.input';
import { RedisPubSub } from 'graphql-redis-subscriptions';
// import { UserAgent } from 'src/common';

@Resolver(() => Sell)
export class SellResolver {
  constructor(
    private readonly sellService: SellService,
    @Inject('PUB_SUB') private readonly pubsub: RedisPubSub,
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => Sell, { nullable: true })
  async getSell(@Args('id') id: string) {
    return this.sellService.getSell(id);
  }

  @UseGuards(AuthGuard)
  @Query(() => Sell, { nullable: true })
  async getUserActiveSell(@Context('userId') userId) {
    return this.sellService.getUserActiveSell({ userId });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Sell)
  async createSell(
    @Args('dto') dto: CreateSellInput,
    @Context('userId') userId,
    @Ip() ip: string,
    // @UserAgent() userAgent: string,
  ) {
    return this.sellService.create({
      dto,
      userId,
      ip,
      // userAgent
    });
  }

  @Subscription(() => Sell, {
    filter: ({ sellStatusChanged }, { id }) => sellStatusChanged.id === id,
  })
  sellStatusChanged(@Args({ name: 'id', type: () => ID }) id: string) {
    return this.pubsub.asyncIterator('sellStatusChanged');
  }
}
