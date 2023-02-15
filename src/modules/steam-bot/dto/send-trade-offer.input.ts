import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { ISteamEconItem } from '../steam-bot.interfaces';

@InputType()
export class Item {
  @Field((type) => String)
  @IsString()
  assetId: string;

  @Field((type) => Number)
  contextid: number;

  @Field((type) => Number)
  appId: number;
}

@InputType()
export class SendTradeOfferInput {
  @Field((type) => String)
  @IsString()
  accountName: string;

  @Field((type) => String)
  @IsString()
  tradeOfferLink: string;

  @Field((type) => [Item])
  @IsString()
  theirItems: ISteamEconItem[];

  @Field((type) => Boolean)
  @IsString()
  giveItem: boolean;
}
