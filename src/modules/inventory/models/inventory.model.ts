import { Field, ObjectType } from '@nestjs/graphql';
import { Skin } from './skin.model';

@ObjectType()
export class Inventory {
  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Skin], { nullable: true })
  skins?: Skin[];
}
