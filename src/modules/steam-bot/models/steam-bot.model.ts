import { Field, ObjectType, HideField } from '@nestjs/graphql';

@ObjectType()
export class SteamBotModel {
  @Field()
  id: string;

  @Field()
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

  @HideField()
  isDeactivated: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
