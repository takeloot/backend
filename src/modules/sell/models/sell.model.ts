import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Skin } from 'src/modules/inventory/models/skin.model';
import { SteamBotModel } from 'src/modules/steam-bot/models/steam-bot.model';
import { User } from 'src/modules/user/models/user.model';

// TODO: Move to @takeloot/dto later
export enum ESellStatus {
  WAITING_SUPPORT_ACCEPT = 'WAITING_SUPPORT_ACCEPT',
  ACCEPTED_BY_SUPPORT = 'ACCEPTED_BY_SUPPORT',
  WAITING_USER_TRADE_CONFIRMATION = 'WAITING_USER_TRADE_CONFIRMATION',
  TRADE_ACCEPTED_BY_USER = 'TRADE_ACCEPTED_BY_USER',
  TRADE_TIMEOUT_EXCEEDED = 'TRADE_TIMEOUT_EXCEEDED',
  PAY_REQUEST_TO_MERCHANT = 'PAY_REQUEST_TO_MERCHANT',
  PAY_ACCEPTED_BY_MERCHANT = 'PAY_ACCEPTED_BY_MERCHANT',
  COMPLETED = 'COMPLETED',
}

registerEnumType(ESellStatus, {
  name: 'ESellStatus',
});

@ObjectType()
export class Sell {
  @Field()
  id: string;

  @Field(() => Number)
  totalItemsPrice: number;

  @Field(() => String)
  paymentProvider: string;

  @Field(() => String)
  wallet: string;

  @Field(() => String)
  email: string;

  @Field(() => [Skin])
  items: Skin[];

  @Field(() => String, { nullable: true })
  givenItem?: Prisma.JsonValue;

  @Field(() => User)
  user: User;

  @Field(() => String)
  ip: string;

  @Field(() => String)
  userAgent: string;

  @Field(() => SteamBotModel)
  steamBot?: SteamBotModel;

  @Field(() => ESellStatus, {
    defaultValue: ESellStatus.WAITING_SUPPORT_ACCEPT,
  })
  status: ESellStatus;

  @Field(() => String)
  tradeId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
