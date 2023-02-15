import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateWorkStatusesInput } from './dto/update-work-statuses.input';

@Injectable()
export class WorkStatusesService {
  constructor(private prisma: PrismaService) {}

  async get() {
    return await this.prisma.workStatuses.findFirst();
  }

  async update(status: UpdateWorkStatusesInput) {
    const workerStatuses = await this.prisma.workStatuses.findFirst({
      where: {
        pk: 1,
      },
    });

    const currentValue = workerStatuses[status.name];

    return await this.prisma.workStatuses.update({
      where: {
        pk: 1,
      },
      data: {
        [status.name]: !currentValue,
      },
    });
  }
}
