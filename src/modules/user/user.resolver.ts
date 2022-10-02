import { Args, Context, ID, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from './models/user.model';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '../auth/guards';

@Resolver(() => User)
export class UserResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => User, { nullable: true })
  async user(
    @Args({ name: 'id', type: () => ID, nullable: true })
    id: string,
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
}
