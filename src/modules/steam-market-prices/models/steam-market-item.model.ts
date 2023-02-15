import { Field, ObjectType } from '@nestjs/graphql';
import { EGame } from '@takeloot/dto';

@ObjectType()
export class SteamMarketItem {
  @Field()
  name: string;

  @Field()
  price: number;

  @Field(() => EGame)
  gameId: EGame;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
