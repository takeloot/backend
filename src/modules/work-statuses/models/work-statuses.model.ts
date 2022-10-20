import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WorkStatuses {
  @Field()
  id: string;

  @Field({ defaultValue: false })
  isDepositDisabled: boolean;

  @Field({ defaultValue: false })
  isWithdrawalDisabled: boolean;

  @Field({ defaultValue: false })
  isSellDisabled: boolean;

  @Field({ defaultValue: false })
  isMaintenance: boolean;

  @Field({ defaultValue: false })
  isSteamProblems: boolean;

  @Field({ defaultValue: false })
  isFuckup: boolean;

  @Field({ defaultValue: false })
  isQiwiDisabled: boolean;

  @Field({ defaultValue: false })
  isTinkoffDisabled: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
