import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SteamBotModel {
  @Field()
  id: string;

  @Field()
  accountName: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  proxy?: string;

  @Field()
  sharedSecret: string;

  @Field()
  identitySecret: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field()
  name: string;

  @Field()
  profileUrl: string;

  @Field({ nullable: true })
  tradeUrl?: string;

  @Field(() => [String])
  cookies: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
