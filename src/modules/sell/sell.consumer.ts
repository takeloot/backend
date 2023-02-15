import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  MOVE_TO_PAYOUT_STAGE_JOB,
  EXECUTE_TRADE_STAGE_JOB,
  SELL_QUEUE,
} from './sell.constants';
import { SellFacade } from './sell.facade';
import {
  IMoveToPayoutStageJob,
  IExecuteTradeStageJob,
} from './sell.interfaces';

@Processor(SELL_QUEUE)
export class SellConsumer {
  constructor(private sellFacade: SellFacade) {}

  @Process(EXECUTE_TRADE_STAGE_JOB)
  public async executeTradeStage(job: Job<IExecuteTradeStageJob>) {
    const { sellId } = job.data;

    await this.sellFacade.executeTradeStage(sellId);
  }

  @Process(MOVE_TO_PAYOUT_STAGE_JOB)
  public async moveToPayoutStage(job: Job<IMoveToPayoutStageJob>) {
    const { sellId } = job.data;

    await this.sellFacade.moveToPayoutStage(sellId);
  }

  // @Process(EXECUTE_PAYOUT_STAGE_JOB)
  // public async executePayoutStageJob(job: Job<IExecutePayoutStageJob>) {
  //   const { sellId } = job.data;

  //   await this.sellFacade.executePayoutStage(sellId);
  // }

  // @Process(EXECUTE_PAYOUT_CHECK_STAGE_JOB)
  // public async executePayoutCheckStageJob(
  //   job: Job<IExecutePayoutCheckStageJob>,
  // ) {
  //   const { sellId } = job.data;

  //   await this.sellFacade.executePayoutCheckStage(sellId);
  // }
}
