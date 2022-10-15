import {
  Body,
  Controller,
  Headers,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from '../auth/auth.service';
import { CreateSteamBotInput } from './dto/create-steam-bot.input';
import { SteamBotService } from './steam-bot.service';

@Controller()
export class SteamBotController {
  constructor(
    private authService: AuthService,
    private steamBotService: SteamBotService,
  ) {}

  @Post('steam-bot/create')
  @UseInterceptors(FileInterceptor('maFile'))
  async steamBotCreate(
    @UploadedFile() file,
    @Body() dto: CreateSteamBotInput,
    @Headers('Authorization') token: string,
  ) {
    const { userId } = await this.authService.getTokenData(token);

    if (!userId) {
      throw new Error('Deny');
    }

    dto.maFile = file;

    return this.steamBotService.create(dto);
  }
}
