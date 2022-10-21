import { Field, ObjectType } from '@nestjs/graphql';
import { Skin } from 'src/modules/inventory/models/skin.model';
import { User } from 'src/modules/user/models/user.model';

@ObjectType()
export class Sell {
  @Field()
  id: string;

  @Field(() => Number)
  totalItemsPrice: number;

  @Field(() => String)
  paymentProvider: string;

  @Field(() => String)
  wallet: string;

  @Field(() => String)
  email: string;

  @Field(() => [Skin])
  items: Skin[];

  @Field(() => User)
  user: User;

  @Field(() => String)
  ip: string;

  @Field(() => String)
  userAgent: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
