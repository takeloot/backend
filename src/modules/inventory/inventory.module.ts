import { InventoryService } from './inventory.service';
import { Module } from '@nestjs/common';
import { InventoryResolver } from './inventory.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [],
  providers: [InventoryResolver, InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
