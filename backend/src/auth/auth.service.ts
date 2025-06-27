import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  GoogleUserDto,
  Auth0UserDto,
  LoginResponseDto,
  UserProfileDto,
} from './dto/auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async auth0Login(auth0User: Auth0UserDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findOrCreateFromAuth0(auth0User);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const access_token = this.jwtService.sign(payload);

    const userProfile: UserProfileDto = {
      id: user.id,
      email: user.email,
      name: user.name || '',
      picture: user.picture ?? undefined,
    };

    return {
      access_token,
      user: userProfile,
    };
  }

  async googleConnect(
    googleUser: GoogleUserDto,
    userId: string,
  ): Promise<void> {
    await this.usersService.connectGoogleAccount(googleUser, userId);
  }

  async googleLogin(googleUser: GoogleUserDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findOrCreateFromGoogle(googleUser);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const access_token = this.jwtService.sign(payload);

    const userProfile: UserProfileDto = {
      id: user.id,
      email: user.email,
      name: user.name || '',
      picture: user.picture || '',
    };

    return {
      access_token,
      user: userProfile,
    };
  }

  async getGoogleConnectionStatus(userId: string) {
    return this.usersService.getGoogleConnectionStatus(userId);
  }

  async validateUser(payload: JwtPayload) {
    return this.usersService.findById(payload.sub);
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new Error('Invalid or expired token');
    }
  }
}
