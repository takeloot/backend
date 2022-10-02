import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Skin {
  @Field()
  id: string;

  @Field()
  steamId: string;

  @Field()
  steamName: string;

  @Field()
  steamImg: string;
}

@ObjectType()
export class Inventory {
  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Skin], { nullable: true })
  skins?: Skin[];
}
