import {
  Controller,
  Get,
  Logger,
  Query,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  private readonly logger = new Logger(AuthController.name);

  async authend(req, res) {
    const { redirectUri, codeHandler } = req.session;

    this.logger.debug({ req, res });

    this.logger.debug({ redirectUri, codeHandler });

    const profile = req?.user;

    this.logger.debug({ profile });

    // Update or create profile and user
    if (!profile) {
      // Redirect with error
      return res.redirect(redirectUri);
    }

    const existProfile = await this.prisma.profile.findFirst({
      where: {
        provider: profile?.provider,
        serviceId: profile?.serviceId,
      },
    });

    let userId;

    this.logger.debug({ existProfile });

    if (existProfile) {
      await this.prisma.profile.update({
        where: { id: existProfile.id },
        data: {
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken,
          name: profile.name,
          avatar: profile.avatar,
          user: {
            update: {
              name: profile.name,
              avatar: profile.avatar,
            },
          },
        },
      });

      userId = existProfile.userId;
    } else {
      const newProfile = await this.prisma.profile.create({
        data: {
          provider: profile.provider,
          serviceId: profile.serviceId,
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken,
          name: profile.name,
          avatar: profile.avatar,
          user: {
            create: {
              name: profile.name,
              avatar: profile.avatar,
            },
          },
        },
      });

      this.logger.debug({ newProfile });

      userId = newProfile.userId;
    }

    const token = await this.authService.createToken(userId);

    this.logger.debug({ token });

    return res.redirect(`${codeHandler}token=${token}&redirect=${redirectUri}`);
  }

  // Steam
  @Get('auth/steam')
  authSteam(
    @Request() req,
    @Response() res,
    @Query('code_handler') codeHandler,
    @Query('redirect_uri') redirectUri,
  ) {
    req.session.codeHandler = codeHandler;
    req.session.redirectUri = redirectUri;

    this.logger.debug({ req, res });

    this.logger.debug('req.session', req.session);

    res.redirect(`${this.config.get('base.apiUrl')}authwr/steam`);
  }

  @Get('authwr/steam')
  @UseGuards(AuthGuard('steam'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  authWRSteam() {}

  @Get('authend/steam')
  @UseGuards(AuthGuard('steam'))
  async authendSteam(@Request() req, @Response() res) {
    this.logger.debug({ req, res });
    return this.authend(req, res);
  }
}
