import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WorkStatusesService } from './work-statuses.service';
import { WorkStatuses } from './models/work-statuses.model';
import { UpdateWorkStatusesInput } from './dto/update-work-statuses.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards';

@Resolver(() => WorkStatuses)
export class WorkStatusesResolver {
  constructor(private readonly workStatusesService: WorkStatusesService) {}

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
    return await this.workStatusesService.update(status);
  }
}
