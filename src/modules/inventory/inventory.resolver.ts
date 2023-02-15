import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Context, Args, ID, Int } from '@nestjs/graphql';
import { AuthGuard } from '../auth/guards';
import { Inventory } from './models/inventory.model';
import { InventoryService } from './inventory.service';

@Resolver('Inventory')
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  // @UseGuards(AuthGuard)
  // @Query(() => Inventory, { nullable: true })
  // // 730
  // // buyBonus=30
  // // isStore=true
  // // limit=60
  // // maxPrice=10000
  // // minPrice=1
  // // offset=0
  // // sort=botFirst
  // // withStack=true
  // async botsInventory(
  //   @Args({ name: 'appId', type: () => Int })
  //   appId: number,
  //   @Args({ name: 'userId', type: () => ID })
  //   userId: string,
  // ) {
  //   return await this.prisma.inventory.findFirst({
  //     where: { id },
  //     include: { skins: true },
  //   });
  // }

  @UseGuards(AuthGuard)
  @Query(() => Inventory, { nullable: true })
  // inventoryType=allSkins
  // limit=60
  // offset=0
  // order=desc
  // sort=priceAndUnsellable
  async userInventory(
    @Args({ name: 'appId', type: () => Int })
    appId: number,
    @Args({ name: 'userId', type: () => ID })
    userId: string,
  ) {
    return await this.inventoryService.getUserInventory({ appId, userId });
  }

  @UseGuards(AuthGuard)
  @Query(() => Inventory, { nullable: true })
  async myInventory(
    // inventoryType=allSkins
    // limit=60
    // offset=0
    // order=desc
    // sort=priceAndUnsellable
    @Args({ name: 'appId', type: () => Int })
    appId: number,
    @Context('userId') userId,
  ): Promise<Inventory> {
    return await this.inventoryService.getUserInventory({ appId, userId });
  }
}
