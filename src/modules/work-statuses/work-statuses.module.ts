import { Module } from '@nestjs/common';
import { WorkStatusesService } from './work-statuses.service';
import { WorkStatusesResolver } from './work-statuses.resolver';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [WorkStatusesResolver, WorkStatusesService],
})
export class WorkStatusesModule {}
