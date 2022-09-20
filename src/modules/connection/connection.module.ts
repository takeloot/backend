import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { ConnectionService } from './connection.service';
import { ConnectionResolver } from './connection.resolver';
import { ConnectionProcessor } from './connection.processor';
import { Queue } from 'bull';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'connection',
    }),
  ],
  providers: [ConnectionService, ConnectionResolver, ConnectionProcessor],
  exports: [ConnectionService],
})
export class ConnectionModule implements OnApplicationBootstrap {
  constructor(
    @InjectQueue('connection') private readonly connectionQueue: Queue,
  ) {}

  onApplicationBootstrap() {
    this.connectionQueue.add('cleanup', null, { repeat: { every: 4e3 } });
  }
}
