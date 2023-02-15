import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AuthService } from '../auth.service';

@Injectable()
export class CreatorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const { token } = ctx.getArgs()[2];
    const { userId } = await this.authService.getTokenData(token);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const accessGranted = user?.role === UserRole.CREATOR;

    return !!accessGranted;
  }
}
