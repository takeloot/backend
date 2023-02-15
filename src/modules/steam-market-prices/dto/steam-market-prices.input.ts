import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { EGame } from '@takeloot/dto';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

registerEnumType(EGame, {
  name: 'EGame',
});

@InputType()
export class SearchQueryInput {
  @Field((type) => String)
  @IsString()
  @IsOptional()
  name?: string;

  @Field((type) => Number)
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  price?: number;

  @Field((type) => String)
  @IsString()
  @IsOptional()
  compare?: string;

  @Field((type) => Number)
  @IsNumber({ maxDecimalPlaces: 0 })
  @Max(30)
  @IsOptional()
  limit?: number = 1;
}

@InputType()
export class UpdatePriceInput {
  @Field((type) => Number)
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  price: number;
}

@InputType()
export class UpdatePricesInput {
  @Field((type) => EGame)
  game: EGame;
}
