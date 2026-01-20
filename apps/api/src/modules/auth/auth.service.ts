/**
 * Auth Service
 * Authentication business logic
 * @module modules/auth/auth.service
 */

import { Injectable, Logger, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { FirebaseAdminService } from './firebase-admin.service';
import type { User, CreateUserInput, AuthProvider, SupportedLanguage, SupportedCountry } from '@vintedge/shared';

interface RegisterUserDto {
  firebaseUid: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  authProvider: AuthProvider;
  language?: SupportedLanguage;
  country?: SupportedCountry;
}

interface LoginResult {
  user: User;
  isNewUser: boolean;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseAdmin: FirebaseAdminService,
  ) {}

  /**
   * Register or login user after Firebase authentication
   * This is called after the client authenticates with Firebase
   */
  async registerOrLogin(dto: RegisterUserDto): Promise<LoginResult> {
    const { firebaseUid, email, displayName, photoUrl, authProvider, language, country } = dto;

    // Check if user exists
    let user = await this.prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (user) {
      // Update last login
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          // Update profile if changed
          ...(displayName && { displayName }),
          ...(photoUrl && { photoUrl }),
        },
      });

      this.logger.log({ userId: user.id, email }, 'User logged in');

      return {
        user: this.mapToUser(user),
        isNewUser: false,
      };
    }

    // Create new user
    user = await this.prisma.user.create({
      data: {
        firebaseUid,
        email,
        displayName,
        photoUrl,
        authProvider: this.mapAuthProvider(authProvider),
        preferences: {
          language: language || 'en',
          country: country || 'US',
          currency: 'USD',
          timezone: 'UTC',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
        },
        lastLoginAt: new Date(),
      },
    });

    // Set custom claims in Firebase (for role-based access)
    await this.firebaseAdmin.setCustomClaims(firebaseUid, {
      role: 'customer',
      vintedgeUserId: user.id,
    });

    this.logger.log({ userId: user.id, email }, 'New user registered');

    return {
      user: this.mapToUser(user),
      isNewUser: true,
    };
  }

  /**
   * Get user by Firebase UID
   */
  async getUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { firebaseUid },
    });

    return user ? this.mapToUser(user) : null;
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.mapToUser(user) : null;
  }

  /**
   * Verify age for user
   */
  async verifyAge(userId: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ageVerified: true,
        ageVerifiedAt: new Date(),
      },
    });

    this.logger.log({ userId }, 'User age verified');

    return this.mapToUser(user);
  }

  /**
   * Logout user (revoke tokens)
   */
  async logout(firebaseUid: string): Promise<void> {
    await this.firebaseAdmin.revokeRefreshTokens(firebaseUid);
    this.logger.log({ firebaseUid }, 'User logged out, tokens revoked');
  }

  /**
   * Delete user account
   */
  async deleteAccount(userId: string, firebaseUid: string): Promise<void> {
    // Delete from database
    await this.prisma.user.delete({
      where: { id: userId },
    });

    // Delete from Firebase
    await this.firebaseAdmin.deleteUser(firebaseUid);

    this.logger.log({ userId, firebaseUid }, 'User account deleted');
  }

  /**
   * Map Prisma user to domain User type
   */
  private mapToUser(prismaUser: any): User {
    return {
      id: prismaUser.id,
      firebaseUid: prismaUser.firebaseUid,
      email: prismaUser.email,
      emailVerified: prismaUser.emailVerified,
      displayName: prismaUser.displayName,
      photoUrl: prismaUser.photoUrl,
      phoneNumber: prismaUser.phoneNumber,
      role: prismaUser.role.toLowerCase() as any,
      authProvider: prismaUser.authProvider.toLowerCase() as AuthProvider,
      preferences: prismaUser.preferences as any,
      ageVerified: prismaUser.ageVerified,
      ageVerifiedAt: prismaUser.ageVerifiedAt,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      lastLoginAt: prismaUser.lastLoginAt,
      isActive: prismaUser.isActive,
    };
  }

  /**
   * Map auth provider string to Prisma enum
   */
  private mapAuthProvider(provider: AuthProvider): any {
    const map: Record<AuthProvider, string> = {
      email: 'EMAIL',
      google: 'GOOGLE',
      facebook: 'FACEBOOK',
      apple: 'APPLE',
    };
    return map[provider] || 'EMAIL';
  }
}
