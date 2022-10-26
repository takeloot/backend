import { InputType, Field, registerEnumType } from '@nestjs/graphql';

// TODO: Move to @takeloot/dto later
export enum EStatus {
  IS_DEPOSIT_ENABLED = 'isDepositEnabled',
  IS_WITHDRAWAL_ENABLED = 'isWithdrawalEnabled',
  IS_SELL_ENABLED = 'isSellEnabled',
  IS_MAINTENANCE = 'isMaintenance',
  IS_STEAM_PROBLEMS = 'isSteamProblems',
  IS_FUCKUP = 'isFuckup',
  IS_QIWI_ENABLED = 'isQiwiEnabled',
  IS_TINKOFF_ENABLED = 'isTinkoffEnabled',
}

registerEnumType(EStatus, {
  name: 'EStatus',
});

@InputType()
export class UpdateWorkStatusesInput {
  @Field(() => EStatus)
  name: EStatus;
}
