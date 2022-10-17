import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Sell {
  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
