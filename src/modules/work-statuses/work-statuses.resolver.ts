import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { WorkStatusesService } from './work-statuses.service';
import { WorkStatuses } from './models/work-statuses.model';
import { UpdateWorkStatusesInput } from './dto/update-work-statuses.input';
import { Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver(() => WorkStatuses)
export class WorkStatusesResolver {
  constructor(
    private readonly workStatusesService: WorkStatusesService,
    @Inject('PUB_SUB') private readonly pubsub: RedisPubSub,
  ) {}

  // TODO: Add creator/admin guard later
  @UseGuards(AuthGuard)
  @Query(() => WorkStatuses, { name: 'workStatuses' })
  async getWorkStatuses() {
    return await this.workStatusesService.get();
  }

  // TODO: Add creator/admin guard later
  @UseGuards(AuthGuard)
  @Mutation(() => WorkStatuses)
  async toggleWorkStatus(@Args('status') status: UpdateWorkStatusesInput) {
    const updatedWorkStatuses = await this.workStatusesService.update(status);

    this.pubsub.publish('workStatusesUpdated', {
      workStatusesUpdated: updatedWorkStatuses,
    });

    return updatedWorkStatuses;
  }

  @Subscription(() => WorkStatuses)
  workStatusesUpdated() {
    return this.pubsub.asyncIterator('workStatusesUpdated');
  }
}
