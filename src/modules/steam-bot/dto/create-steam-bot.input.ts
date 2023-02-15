import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateSteamBotInput {
  @Field((type) => String)
  @IsString()
  accountName: string;

  @Field((type) => String)
  @IsString()
  password: string;

  @Field((type) => String)
  @IsString()
  proxy?: string;

  @Field((type) => String)
  maFile: { buffer: Buffer };
}
