import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleUserDto, Auth0UserDto } from '../auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        oauthAccounts: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        oauthAccounts: true,
      },
    });
  }

  async createFromAuth0(auth0User: Auth0UserDto) {
    const {
      id: auth0Id,
      email,
      name,
      picture,
      accessToken,
      refreshToken,
    } = auth0User;

    return this.prisma.user.create({
      data: {
        email,
        name,
        picture,
        oauthAccounts: {
          create: {
            provider: 'auth0',
            providerAccountId: auth0Id,
            accessToken,
            refreshToken,
          },
        },
      },
      include: {
        oauthAccounts: true,
      },
    });
  }

  async createFromGoogle(googleUser: GoogleUserDto) {
    const {
      id: googleId,
      email,
      firstName,
      lastName,
      picture,
      accessToken,
      refreshToken,
    } = googleUser;

    return this.prisma.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        picture,
        oauthAccounts: {
          create: {
            provider: 'google',
            providerAccountId: googleId,
            accessToken,
            refreshToken,
          },
        },
      },
      include: {
        oauthAccounts: true,
      },
    });
  }

  async updateAuth0Tokens(
    userId: string,
    accessToken: string,
    refreshToken?: string,
  ) {
    const updateData: any = { accessToken };
    if (refreshToken) {
      updateData.refreshToken = refreshToken;
    }

    return this.prisma.oAuthAccount.updateMany({
      where: {
        userId,
        provider: 'auth0',
      },
      data: updateData,
    });
  }

  async updateGoogleTokens(
    userId: string,
    accessToken: string,
    refreshToken?: string,
  ) {
    const updateData: any = { accessToken };
    if (refreshToken) {
      updateData.refreshToken = refreshToken;
    }

    return this.prisma.oAuthAccount.updateMany({
      where: {
        userId,
        provider: 'google',
      },
      data: updateData,
    });
  }

  async findOrCreateFromAuth0(auth0User: Auth0UserDto) {
    const existingUser = await this.findByEmail(auth0User.email);

    if (existingUser) {
      await this.updateAuth0Tokens(
        existingUser.id,
        auth0User.accessToken,
        auth0User.refreshToken,
      );
      return existingUser;
    }

    return this.createFromAuth0(auth0User);
  }

  async findOrCreateFromGoogle(googleUser: GoogleUserDto) {
    const existingUser = await this.findByEmail(googleUser.email);

    if (existingUser) {
      await this.updateGoogleTokens(
        existingUser.id,
        googleUser.accessToken,
        googleUser.refreshToken,
      );
      return existingUser;
    }

    return this.createFromGoogle(googleUser);
  }

  async getGoogleConnectionStatus(userId: string) {
    const googleConnection = await this.prisma.oAuthAccount.findFirst({
      where: {
        userId,
        provider: 'google',
      },
    });

    return {
      connected: !!googleConnection,
      connectedAt: googleConnection?.createdAt || null,
    };
  }

  async connectGoogleAccount(googleUser: GoogleUserDto, userId: string) {

    const existingConnection = await this.prisma.oAuthAccount.findFirst({
      where: {
        userId,
        provider: 'google',
      },
    });

    if (existingConnection) {
      return this.prisma.oAuthAccount.update({
        where: { id: existingConnection.id },
        data: {
          accessToken: googleUser.accessToken,
          refreshToken: googleUser.refreshToken,
        },
      });
    }

    return this.prisma.oAuthAccount.create({
      data: {
        provider: 'google',
        providerAccountId: googleUser.id,
        accessToken: googleUser.accessToken,
        refreshToken: googleUser.refreshToken,
        userId,
      },
    });
  }
}
