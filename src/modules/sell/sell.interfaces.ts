export interface IExecuteTradeStageJob {
  sellId: string;
}

export interface IMoveToPayoutStageJob {
  sellId: string;
}

export interface IExecutePayoutStageJob {
  sellId: string;
}

export interface IExecutePayoutCheckStageJob {
  sellId: string;
}

export enum ETradeOfferState {
  'Invalid' = 1,
  'Active' = 2,
  'Accepted' = 3,
  'Countered' = 4,
  'Expired' = 5,
  'Canceled' = 6,
  'Declined' = 7,
  'InvalidItems' = 8,
  'CreatedNeedsConfirmation' = 9,
  'CanceledBySecondFactor' = 10,
  'InEscrow' = 11,
}
