/**
 * Auth DTOs
 * Data transfer objects for authentication
 * @module modules/auth/dto
 */

import { IsString, IsEmail, IsOptional, IsBoolean, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { AuthProvider, SupportedLanguage, SupportedCountry } from '@vintedge/shared';

export class RegisterDto {
  @ApiProperty({ description: 'Firebase user UID' })
  @IsString()
  firebaseUid!: string;

  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ description: 'Display name' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({ description: 'Profile photo URL' })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiProperty({ description: 'Authentication provider', enum: ['email', 'google', 'facebook', 'apple'] })
  @IsIn(['email', 'google', 'facebook', 'apple'])
  authProvider!: AuthProvider;

  @ApiPropertyOptional({ description: 'Preferred language', enum: ['en', 'es', 'pt', 'hi', 'ja'] })
  @IsOptional()
  @IsIn(['en', 'es', 'pt', 'hi', 'ja'])
  language?: SupportedLanguage;

  @ApiPropertyOptional({ description: 'Country', enum: ['CA', 'US', 'MX', 'CO', 'BR', 'CL', 'AR', 'GB', 'NL', 'IN', 'JP'] })
  @IsOptional()
  @IsIn(['CA', 'US', 'MX', 'CO', 'BR', 'CL', 'AR', 'GB', 'NL', 'IN', 'JP'])
  country?: SupportedCountry;
}

export class VerifyAgeDto {
  @ApiProperty({ description: 'User confirms they are of legal drinking age' })
  @IsBoolean()
  confirmed!: boolean;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Firebase refresh token' })
  @IsString()
  refreshToken!: string;
}
