import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WorkStatuses {
  @Field()
  id: string;

  @Field({ defaultValue: true })
  isDepositEnabled: boolean;

  @Field({ defaultValue: true })
  isWithdrawalEnabled: boolean;

  @Field({ defaultValue: true })
  isSellEnabled: boolean;

  @Field({ defaultValue: false })
  isMaintenance: boolean;

  @Field({ defaultValue: false })
  isSteamProblems: boolean;

  @Field({ defaultValue: false })
  isFuckup: boolean;

  @Field({ defaultValue: true })
  isQiwiEnabled: boolean;

  @Field({ defaultValue: true })
  isTinkoffEnabled: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
