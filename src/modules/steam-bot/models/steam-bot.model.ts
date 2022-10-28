import { Field, ObjectType, HideField } from '@nestjs/graphql';

@ObjectType()
export class SteamBotModel {
  @Field()
  id: string;

  @HideField()
  accountName: string;

  @HideField()
  password: string;

  @HideField()
  proxy?: string;

  @HideField()
  sharedSecret: string;

  @HideField()
  identitySecret: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field()
  name: string;

  @Field()
  profileUrl: string;

  @Field({ nullable: true })
  tradeUrl?: string;

  @HideField()
  cookies: string[];

  @Field()
  isDeactivated: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
