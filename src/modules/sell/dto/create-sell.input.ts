import { InputType, Field } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { SellItem } from '../models/sell-item.model';

@InputType()
export class CreateSellInput {
  @Field((type) => [SellItem])
  @ArrayNotEmpty()
  items: SellItem[];

  @Field((type) => String)
  @IsString()
  @IsNotEmpty()
  paymentProvider: string;

  @Field((type) => String)
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field((type) => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  purse: string;
}
