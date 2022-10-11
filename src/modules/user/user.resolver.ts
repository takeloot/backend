import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from './models/user.model';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '../auth/guards';

@Resolver(() => User)
export class UserResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => User, { nullable: true })
  async user(
    @Args({ name: 'id', type: () => ID, nullable: true }) id: string,
    @Context('userId') userId,
  ) {
    if (!id) {
      if (!userId) return null;
      id = userId;
    }

    return await this.prisma.user.findFirst({
      where: { id },
      include: { profiles: true },
    });
  }

  @UseGuards(AuthGuard)
  @Query(() => User)
  async me(@Context('userId') userId): Promise<User> {
    return await this.prisma.user.findFirst({
      where: { id: userId },
      include: { profiles: true },
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async updateMyTradeUrl(
    @Args({ name: 'tradeURL', type: () => String, nullable: true })
    tradeURL: string,
    @Context('userId') userId,
  ) {
    const steamTradeUrlRegex =
      /https?:\/\/steamcommunity.com\/tradeoffer\/new\/\?partner=(\d+)&token=(.{8})$/;

    if (!tradeURL || !tradeURL.match(steamTradeUrlRegex)) {
      throw new Error('Invalid trade URL');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        tradeURL,
      },
    });

    return true;
  }
}
