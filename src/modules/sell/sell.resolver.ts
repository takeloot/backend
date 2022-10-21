import { Resolver, Args, Mutation, ID } from '@nestjs/graphql';
import { SellService } from './sell.service';
import { Sell } from './models/sell.model';
import { Ip, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards';
import { CreateSellInput } from './dto/create-sell.input';
import { UserAgent } from 'src/common';

@Resolver(() => Sell)
export class SellResolver {
  constructor(private readonly sellService: SellService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Sell)
  async createSell(
    @Args('dto') dto: CreateSellInput,
    @Args({ name: 'userId', type: () => ID })
    userId: string,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
  ) {
    return this.sellService.create({ dto, userId, ip, userAgent });
  }
}
