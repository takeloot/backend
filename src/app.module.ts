import { SteamMarketPricesModule } from './modules/steam-market-prices/steam-market-prices.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { config } from './config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { join } from 'path';
import { BullModule } from '@nestjs/bull';
import { ConnectionModule } from './modules/connection/connection.module';
import { ConnectionService } from './modules/connection/connection.service';
import { nanoid } from 'nanoid';
import { InventoryModule } from './modules/inventory/inventory.module';
import { SteamBotModule } from './modules/steam-bot/steam-bot.module';
import { WorkStatusesModule } from './modules/work-statuses/work-statuses.module';
import { SharedModule } from './shared.module';
import { SellModule } from './modules/sell/sell.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('db.redisHost'),
          port: configService.get('db.redisPort'),
        },
        defaultJobOptions: {
          removeOnComplete: true,
        },
      }),
      inject: [ConfigService],
    }),
    SharedModule,
    ScheduleModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule, ConnectionModule],
      inject: [AuthService, ConnectionService],
      useFactory: async (
        authService: AuthService,
        connectionService: ConnectionService,
      ) => ({
        installSubscriptionHandlers: true,
        // validationRules: [depthLimit(10)],
        autoSchemaFile: join(process.cwd(), './schema.gql'),
        context: (ctx) => ctx?.extra?.socket?.ctx,
        subscriptions: {
          'subscriptions-transport-ws': true,
          'graphql-ws': {
            onConnect: async (ctx: any) => {
              const token = ctx?.connectionParams?.token as string;

              let ipHash;

              const xForwardedFor =
                ctx?.extra?.request?.headers['x-original-forwarded-for'];

              if (xForwardedFor && typeof xForwardedFor === 'string') {
                const ip = xForwardedFor.split(/\s*,\s*/)[0];
                ipHash = Buffer.from(ip).toString('base64');
              }

              const { userId } = await authService.getTokenData(token);

              const connectionId = nanoid();

              const data = { token, userId, ipHash, connectionId };

              ctx.extra.socket.ctx = data;

              return data;
            },
            onDisconnect: async (ctx: any) => {
              const data = ctx?.extra?.socket?.ctx;

              const connectionId = data.connectionId;
              if (connectionId) {
                await connectionService.remove(connectionId);
              }
            },
          },
        },
      }),
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    InventoryModule,
    SteamBotModule,
    WorkStatusesModule,
    SellModule,
    SteamMarketPricesModule,
  ],
})
export class AppModule {}
