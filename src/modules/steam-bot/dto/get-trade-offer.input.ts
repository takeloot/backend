import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class GetTradeOfferInput {
  @Field((type) => String)
  @IsString()
  accountName: string;

  @Field((type) => String)
  @IsString()
  tradeId: string;
}
