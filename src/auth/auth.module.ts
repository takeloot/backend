import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SteamStrategy } from './strategies/steam.strategy';
import { AuthResolver } from './auth.resolver';
import { AuthGuard } from './guards';

@Module({
  imports: [PassportModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthResolver, AuthService, SteamStrategy, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
