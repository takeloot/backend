import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from './models/user.model';
import { AdminGuard, AuthGuard } from '../auth/guards';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Query(() => [User])
  // limit=60
  // offset=0
  // order=desc
  async users() {
    return await this.userService.getUsers();
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Query(() => User, { nullable: true })
  async user(
    @Args({ name: 'id', type: () => ID, nullable: true }) id: string,
    @Context('userId') userId,
  ) {
    return await this.userService.getUserById(id, userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => User)
  async me(@Context('userId') userId): Promise<User> {
    return await this.userService.getMe(userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async updateMyTradeUrl(
    @Args({ name: 'tradeUrl', type: () => String, nullable: true })
    tradeUrl: string,
    @Context('userId') userId,
  ) {
    return await this.userService.updateMyTradeUrl(tradeUrl, userId);
  }
}
