import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { config } from './config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [AuthService],
      useFactory: async () => ({
        installSubscriptionHandlers: true,
        // validationRules: [depthLimit(10)],
        autoSchemaFile: join(process.cwd(), './schema.gql'),
        context: (ctx) => ctx?.extra?.socket?.ctx,
      }),
    }),
    AuthModule,
    PrismaModule,
    UserModule,
  ],
})
export class AppModule {}
