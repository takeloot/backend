import { InputType, Field, registerEnumType } from '@nestjs/graphql';

export enum EStatus {
  IS_DEPOSIT_DISABLED = 'isDepositDisabled',
  IS_WITHDRAWAL_DISABLED = 'isWithdrawalDisabled',
  IS_SELL_DISABLED = 'isSellDisabled',
  IS_MAINTENANCE = 'isMaintenance',
  IS_STEAM_PROBLEMS = 'isSteamProblems',
  IS_FUCKUP = 'isFuckup',
  IS_QIWI_DISABLED = 'isQiwiDisabled',
  IS_TINKOFF_DISABLED = 'isTinkoffDisabled',
}

registerEnumType(EStatus, {
  name: 'EStatus',
});

@InputType()
export class UpdateWorkStatusesInput {
  @Field(() => EStatus)
  name: EStatus;
}
