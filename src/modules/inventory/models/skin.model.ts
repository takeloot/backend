import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Case {
  @Field()
  id: string;

  @Field()
  img: string;

  @Field()
  name: string;
}

@ObjectType()
export class Collection {
  @Field()
  id: string;

  @Field()
  img: string;

  @Field()
  name: string;
}

@ObjectType()
export class Sticker {
  @Field()
  id: string;

  @Field()
  img: string;

  @Field()
  name: string;
}
@ObjectType()
export class Skin {
  @Field()
  id: string;

  @Field()
  appId: number;

  @Field()
  assetId: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  img?: string;

  @Field({ nullable: true })
  preview?: string;

  @Field({ nullable: true })
  screenshot?: string;

  @Field({ nullable: true })
  inspect?: string;

  @Field({ nullable: true })
  float?: number;

  @Field({ nullable: true })
  floatMin?: number;

  @Field({ nullable: true })
  floatMax?: number;

  @Field({ nullable: true })
  pattern?: number;

  @Field({ nullable: true })
  quality?: string;

  @Field({ nullable: true })
  rarity?: string;

  @Field({ nullable: true })
  rarityColor?: string;

  @Field({ nullable: true })
  botPrice?: number;

  @Field({ nullable: true })
  defaultPrice?: number;

  @Field({ nullable: true })
  lowestPrice?: number;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  rubPrice?: number;

  @Field({ nullable: true })
  overstockDiff?: number;

  @Field({ nullable: true })
  hasHighDemand?: boolean;

  @Field({ nullable: true })
  isUnsellable?: boolean;

  @Field({ nullable: true })
  model3d?: string;

  @Field(() => [Collection], { nullable: true })
  collection?: Collection[];

  @Field(() => [Case], { nullable: true })
  case?: Case[];

  @Field(() => [Sticker], { nullable: true })
  stickers?: Sticker[];

  @Field({ nullable: true })
  fullName?: string;

  @Field({ defaultValue: false })
  hasScreenshot?: boolean;

  @Field({ nullable: true })
  isStatTrak?: boolean;

  @Field()
  steamId: string;

  @Field()
  steamName: string;

  @Field()
  steamImg: string;
}
