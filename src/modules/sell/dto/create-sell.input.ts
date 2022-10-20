import { InputType, Field } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Skin } from 'src/modules/inventory/models/skin.model';

@InputType()
export class CreateSellInput {
  @Field((type) => [Skin])
  @ArrayNotEmpty()
  items: Skin[];

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
