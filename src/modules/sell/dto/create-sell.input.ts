import { InputType, Field } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  // IsEmail,
  // IsNotEmpty,
  // IsString,
  // MinLength,
} from 'class-validator';

@InputType()
export class Item {
  @Field((type) => String)
  id: string;

  @Field((type) => Number)
  price: number;
}
@InputType()
export class CreateSellInput {
  @Field((type) => [Item])
  @ArrayNotEmpty()
  items: Item[];

  // @Field((type) => String)
  // @IsString()
  // @IsNotEmpty()
  // paymentProvider: string;

  // @Field((type) => String)
  // @IsString()
  // @IsNotEmpty()
  // @IsEmail()
  // email: string;

  // @Field((type) => String)
  // @IsString()
  // @IsNotEmpty()
  // @MinLength(5)
  // wallet: string;
}
