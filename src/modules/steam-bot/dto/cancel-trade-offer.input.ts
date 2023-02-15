import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CancelTradeOfferInput {
  @Field((type) => String)
  @IsString()
  accountName: string;

  @Field((type) => String)
  @IsString()
  tradeId: string;
}
