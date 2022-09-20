import { Strategy } from 'passport-steam';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor(private readonly config: ConfigService) {
    super(config.get('authSteam'));
  }

  async validate(identifier, profile) {
    return {
      provider: 'steam',
      serviceId: profile?.id,
      name: profile?.displayName,
      email: profile?.email,
      avatar: profile?.photos[2].value,
    };
  }
}
