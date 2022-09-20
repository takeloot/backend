import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConnectionService {
  constructor(
    private readonly config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async cleanup() {
    return await this.prisma.connection.deleteMany({
      where: {
        updatedAt: {
          lt: new Date(new Date().getTime() - ms('7s')),
        },
      },
    });
  }

  async updateConnectionStatus({ connectionId, ipHash, userId }) {
    const instanceId = this.config.get('base.instanceId');

    try {
      await this.prisma.connection.upsert({
        where: {
          id: connectionId,
        },
        create: {
          id: connectionId,
          ipHash,
          instanceId,
          userId,
        },
        update: {
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      Logger.error(error);
    }
  }

  async remove(id: string) {
    return this.prisma.connection.deleteMany({ where: { id } });
  }
}
