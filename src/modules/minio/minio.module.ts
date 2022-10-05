import { Module } from '@nestjs/common';
import { MinioModule as MinioClientModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MinioClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          endPoint: config.get('MINIO_ENDPOINT'),
          port: parseInt(config.get('MINIO_PORT')),
          useSSL: false,
          accessKey: config.get('MINIO_ACCESS_KEY'),
          secretKey: config.get('MINIO_SECRET_KEY'),
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class MinioModule {}
