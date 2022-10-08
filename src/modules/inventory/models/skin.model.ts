import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Skin {
  @Field()
  id: string;

  @Field()
  appId: number;

  @Field()
  assetId: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  img: string;

  @Field({ nullable: true })
  preview: string;

  @Field({ nullable: true })
  screenshot: string;

  @Field({ nullable: true })
  inspect: string;

  @Field({ nullable: true })
  float: string;

  @Field({ nullable: true })
  fullName: string;

  @Field({ defaultValue: false })
  hasScreenshot: boolean;

  @Field({ nullable: true })
  isStatTrak: boolean;

  @Field()
  steamId: string;

  @Field()
  steamName: string;

  @Field()
  steamImg: string;
}
