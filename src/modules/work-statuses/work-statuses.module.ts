import { Module } from '@nestjs/common';
import { WorkStatusesService } from './work-statuses.service';
import { WorkStatusesResolver } from './work-statuses.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WorkStatusesResolver, WorkStatusesService],
})
export class WorkStatusesModule {}
