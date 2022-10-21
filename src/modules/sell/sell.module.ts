import { InventoryModule } from './../inventory/inventory.module';
import { Module } from '@nestjs/common';
import { SellService } from './sell.service';
import { SellResolver } from './sell.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, PrismaModule, InventoryModule],
  providers: [SellResolver, SellService],
})
export class SellModule {}
