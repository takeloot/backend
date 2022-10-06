import { InventoryProcessor } from './inventory.processor';
import { InventoryService } from './inventory.service';
import { Module } from '@nestjs/common';
import { InventoryResolver } from './inventory.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    // TODO: Delete this after the issue is resolved
    // https://github.com/djedlajn/nestjs-minio-client/issues/19
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          endPoint: config.get('MINIO_ENDPOINT'),
          port: parseInt(config.get('MINIO_PORT')),
          useSSL: false,
          accessKey: config.get('MINIO_ACCESS_KEY'),
          secretKey: config.get('MINIO_SECRET_KEY'),
        };
      },
    }),
    BullModule.registerQueue({
      name: 'inventory-images-queue',
    }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [],
  providers: [InventoryResolver, InventoryService, InventoryProcessor],
  exports: [InventoryService],
})
export class InventoryModule {}
