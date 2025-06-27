import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserProfileDto, GoogleUserDto, Auth0UserDto } from './dto/auth.dto';

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get('auth0')
  @UseGuards(AuthGuard('auth0'))
  @ApiOperation({ summary: 'Initiate Auth0 OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirects to Auth0 OAuth' })
  async auth0Auth() {}

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Connect Google account for calendar access' })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Google OAuth for calendar access',
  })
  async googleAuth() {}

  @Get('google/connect')
  @ApiOperation({
    summary: 'Connect Google account for calendar access (authenticated users)',
  })
  async googleConnect(
    @Query('token') token: string,
    @CurrentUser() user: AuthUser,
    @Res() res: Response,
  ) {
    let userId: string;

    if (user) {
      userId = user.id;
    } else if (token) {
      try {
        const decoded = await this.authService.verifyToken(token);
        userId = decoded.sub;
      } catch {
        const frontendUrl = this.configService.get<string>('frontend.url');
        return res.redirect(`${frontendUrl}/auth/error?message=Invalid token`);
      }
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const state = Buffer.from(JSON.stringify({ userId }), 'base64').toString(
      'base64',
    );
    const googleAuthUrl = this.buildGoogleAuthUrl(state);
    res.redirect(googleAuthUrl);
  }

  private buildGoogleAuthUrl(state: string): string {
    const clientId = this.configService.get<string>('google.clientId');
    const callbackUrl = this.configService.get<string>('google.callbackUrl');

    if (!clientId || !callbackUrl) {
      throw new Error('Google OAuth configuration is missing');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events.readonly',
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state: state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  @Public()
  @Get('auth0/callback')
  @UseGuards(AuthGuard('auth0'))
  @ApiOperation({ summary: 'Auth0 OAuth callback' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend with token' })
  async auth0AuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const auth0User = req.user as Auth0UserDto;
      const loginResponse = await this.authService.auth0Login(auth0User);

      const frontendUrl = this.configService.get<string>('frontend.url');
      const redirectUrl = `${frontendUrl}/auth/callback?token=${loginResponse.access_token}`;

      console.log(loginResponse);

      res.redirect(redirectUrl);
    } catch (error) {
      console.log(error);
      const frontendUrl = this.configService.get<string>('frontend.url');
      res.redirect(`${frontendUrl}/auth/error`);
    }
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback for calendar connection' })
  @ApiResponse({
    status: 302,
    description: 'Redirects to frontend after connecting Google account',
  })
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const googleUser = req.user as GoogleUserDto;
      const frontendUrl = this.configService.get<string>('frontend.url');

      const stateParam = req.query.state as string;

      if (stateParam) {
        try {
          const decodedState = JSON.parse(
            Buffer.from(stateParam, 'base64').toString(),
          ) as { userId?: string };

          const userId = decodedState.userId;

          if (userId) {
            await this.authService.googleConnect(googleUser, userId);

            res.redirect(`${frontendUrl}/calendar/connected?success=true`);

            return;
          }
        } catch (decodeError) {
          console.error('Error decoding state parameter:', decodeError);
        }
      }

      const loginResponse = await this.authService.googleLogin(googleUser);
      const redirectUrl = `${frontendUrl}/auth/callback?token=${loginResponse.access_token}`;
      console.log('Google login completed:', { userId: loginResponse.user.id });
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const frontendUrl = this.configService.get<string>('frontend.url');
      res.redirect(
        `${frontendUrl}/calendar/error?message=${encodeURIComponent('Failed to connect Google account')}`,
      );
    }
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@CurrentUser() user: AuthUser): UserProfileDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name || '',
      picture: user.picture || undefined,
    };
  }

  @Get('google/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check Google Calendar connection status' })
  @ApiResponse({
    status: 200,
    description: 'Google Calendar connection status',
    schema: {
      type: 'object',
      properties: {
        connected: { type: 'boolean' },
        connectedAt: { type: 'string', format: 'date-time', nullable: true },
      },
    },
  })
  async getGoogleStatus(@CurrentUser() user: AuthUser) {
    return await this.authService.getGoogleConnectionStatus(user.id);
  }

  @Public()
  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  logout(@Res() res: Response) {
    res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
  }
}
