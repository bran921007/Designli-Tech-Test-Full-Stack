import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    description: 'User ID',
    example: 'clm123abc456',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User profile picture URL',
    example: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
    required: false,
  })
  picture?: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
  })
  user: UserProfileDto;
}

export class GoogleUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string | undefined;
  accessToken: string;
  refreshToken: string;
}

export class Auth0UserDto {
  id: string;
  email: string;
  name: string;
  picture: string | null;
  accessToken: string;
  refreshToken: string;
}
