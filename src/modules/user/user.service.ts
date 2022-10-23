import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserById(id: string, userId: string) {
    if (!id) {
      if (!userId) return null;
      id = userId;
    }

    return await this.prisma.user.findFirst({
      where: { id },
      include: { profiles: true },
    });
  }

  async getMe(userId: string) {
    return await this.prisma.user.findFirst({
      where: { id: userId },
      include: { profiles: true },
    });
  }

  async updateMyTradeUrl(tradeUrl: string, userId: string) {
    const steamTradeUrlRegex =
      /https?:\/\/steamcommunity.com\/tradeoffer\/new\/\?partner=(\d+)&token=(.{8})$/;

    if (!tradeUrl || !tradeUrl.match(steamTradeUrlRegex)) {
      throw new Error('Invalid trade Url');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        tradeUrl,
      },
    });

    return true;
  }
}
