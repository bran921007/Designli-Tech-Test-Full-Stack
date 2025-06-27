import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';
import { Auth0UserDto } from '../dto/auth.dto';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(private configService: ConfigService) {
    const domain = configService.get<string>('auth0.domain');
    const clientId = configService.get<string>('auth0.clientId');
    const clientSecret = configService.get<string>('auth0.clientSecret');
    const callbackUrl = configService.get<string>('auth0.callbackUrl');

    if (!domain || !clientId || !clientSecret) {
      throw new Error(
        'Auth0 credentials are missing. Please set AUTH0_DOMAIN, AUTH0_CLIENT_ID, and AUTH0_CLIENT_SECRET environment variables.',
      );
    }

    super({
      domain,
      clientID: clientId,
      clientSecret,
      callbackURL: callbackUrl || '',
      state: false,
    });
  }

  /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
  validate(
    accessToken: string,
    refreshToken: string,
    extraParams: any,
    profile: any,
  ): Auth0UserDto {
    const profileData = profile._json || {};

    const user: Auth0UserDto = {
      id: String(profileData.sub || profile.id || ''),
      email: String(profileData.email || profile.emails?.[0]?.value || ''),
      name: String(profileData.name || profile.displayName || ''),
      picture: profileData.picture || profile.photos?.[0]?.value || null,
      accessToken,
      refreshToken,
    };

    return user;
  }
  /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
}
